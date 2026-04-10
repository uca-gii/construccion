# Jenkins + SonarQube

## Contexto
- Jenkins está levantado en Docker.
- Jenkins usa **Docker-in-Docker (DinD)** para los agentes Docker.
- SonarQube está levantado aparte en Docker.
- El objetivo es integrar un análisis de SonarQube en un pipeline de Jenkins.

---

## Solución más sencilla fue

* usar agentes Docker solo en las etapas que lo necesitan;
* ejecutar la etapa de SonarQube con `agent any`;
* instalar/configurar `SonarScanner` en Jenkins;
* usar `withSonarQubeEnv(...)` para inyectar la configuración del servidor.

---

## Pasos

### 1. Levantar SonarQube

Ejemplo de `docker-compose.yml`:

```yaml
services:
  sonarqube:
    image: sonarqube:lts-community
    container_name: sonarqube
    depends_on:
      - db
    ports:
      - "9000:9000"
    environment:
      SONAR_JDBC_URL: jdbc:postgresql://db:5432/sonarqube
      SONAR_JDBC_USERNAME: sonarqube
      SONAR_JDBC_PASSWORD: sonarqube
    volumes:
      - sonarqube_data:/opt/sonarqube/data
      - sonarqube_logs:/opt/sonarqube/logs
      - sonarqube_extensions:/opt/sonarqube/extensions

  db:
    image: postgres:15
    container_name: sonarqube_db
    environment:
      POSTGRES_USER: sonarqube
      POSTGRES_PASSWORD: sonarqube
      POSTGRES_DB: sonarqube
    volumes:
      - postgresql:/var/lib/postgresql/data

volumes:
  sonarqube_data:
  sonarqube_logs:
  sonarqube_extensions:
  postgresql:
```

Acceso:

* `http://localhost:9000`

---

### 2. Instalar plugin de SonarQube en Jenkins

En Jenkins:

* `Manage Jenkins`
* `Plugins`
* instalar **SonarQube Scanner for Jenkins**

---

### 3. Crear token en SonarQube

En SonarQube:

* entrar con el usuario
* ir al perfil
* crear un token

---

### 4. Guardar el token en Jenkins

En Jenkins:

* `Manage Jenkins`
* `Credentials`
* añadir credencial tipo **Secret text**

---

### 5. Configurar servidor SonarQube en Jenkins

En Jenkins:

* `Manage Jenkins`
* `System`
* sección **SonarQube servers**

Ejemplo:

* **Name**: `SonarQube-Docker`
* **Server URL**: URL del servidor SonarQube (`http://sonarqube:9000`)
* **Server authentication token**: seleccionar la credencial creada

Nota: sonarqube debe ser accesible desde Jenkins, por eso es importante que ambos estén en la misma red de Docker. Se puede modificar el `docker-compose.yml` o conectar a la red de Jenkins directamente:

```bash
docker network connect jenkins sonarqube
```

---

### 6. Configurar SonarScanner en Jenkins

En Jenkins:

* `Manage Jenkins`
* `Global Tool Configuration`
* sección **SonarScanner**
* añadir instalación

Ejemplo:

* **Name**: `SonarScanner`

---

### 7. Añadir `sonar-project.properties` al repositorio

En la raíz del proyecto:

```properties
sonar.projectKey=CI-Jenkins-SonarQube
sonar.projectName=CI-Jenkins-SonarQube
sonar.sources=.
sonar.sourceEncoding=UTF-8
```

---

### 8. Usar distintos agentes por etapa en el `Jenkinsfile`

* `agent none` global
* etapas Docker solo donde hace falta
* etapa de SonarQube con `agent any`

Ejemplo funcional:

```groovy
pipeline {
    agent none

    options {
        timeout(time: 20, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    parameters {
        string(name: 'SLIDES_FILE', defaultValue: 'ejercicio-marp-sonarqube/slides/docker.md', description: 'Fichero Markdown de entrada para Marp')
    }

    triggers {
        pollSCM('H/5 * * * *')
    }

    stages {
        stage('Checkout') {
            agent any
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            agent {
                dockerfile {
                    filename 'Dockerfile'
                    dir 'ejercicio-marp-sonarqube'
                }
            }
            steps {
                sh 'npm install @marp-team/marp-cli'
            }
        }

        stage('SonarQube Analysis') {
            agent any
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube-Docker') {
                        sh """
                          ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=CI-Jenkins-SonarQube \
                            -Dsonar.sources=. \
                            -Dsonar.projectBaseDir=$WORKSPACE
                        """
                    }
                }
            }
        }

        stage('Generate PDF') {
            agent {
                dockerfile {
                    filename 'Dockerfile'
                    dir 'ejercicio-marp-sonarqube'
                }
            }
            steps {
                sh 'mkdir -p pdf'
                sh 'npx marp --allow-local-files --pdf --output pdf/slides.pdf "$SLIDES_FILE"'
            }
        }

        stage('Archive artifact') {
            agent any
            steps {
                archiveArtifacts artifacts: 'pdf/*.pdf', fingerprint: true
            }
        }
    }
}
```

---

## Resumen rápido

1. Levantar SonarQube.
2. Instalar plugin de SonarQube en Jenkins.
3. Crear token en SonarQube.
4. Guardar token en Jenkins.
5. Configurar servidor SonarQube en Jenkins.
6. Configurar `SonarScanner` en Jenkins.
7. Añadir `sonar-project.properties`.
8. En el pipeline:

   * usar Docker solo en las etapas necesarias;
   * ejecutar SonarQube con `agent any`.

---

## Recomendación

Si Jenkins usa DinD, evitar ejecutar SonarQube dentro de una etapa con `agent docker` o `agent dockerfile`.
La opción más simple y estable es ejecutar el análisis en una etapa aparte con `agent any`.
