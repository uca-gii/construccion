---
marp: true
title: Prácticas de Jenkins
description: Asignaturas del grado en Ingeniería Informática 
---

<!-- size: 16:9 -->
<!-- theme: default -->

<!-- paginate: skip -->
<!-- headingDivider: 1 -->

<style>
h1 {
  text-align: center;
  color: #005877;
}
h2 {
  color: #E87B00;
}
h3 {
  color: #005877;
}

img[alt~="center"] {
  display: block;
  margin: 0 auto;
}
img[alt~="float"] {
  display: float;
  margin: 8px 5px 0 5px;
}
emph {
  color: #E87B00;
}
.cols {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
.cols > div {
  align-self: start;
}
</style>

# CI/CD con Jenkins

![width:300 center](img/jenkins.svg)

---

<!-- paginate: true -->

## Continous Integration / Continuous Delivery

![bg left:33% 90%](img/cicd_side.png)

- Continuous integration (CI)
- Continuous delivery (CD)
- Continuous deployment

Cada proceso tiene su propio <emph>pipeline</emph>

<!--

Cada uno de estos procesos tiene su propio pipeline

-->

---

### Pipeline de CI

CI es la práctica de construir y probar las aplicaciones en cada nueva versión.

![CI pipeline](img/ci-pipeline.png)


---

### Pipeline de CD

CD añade pruebas automáticas y despliegue automático al proceso de CI.

![CD pipeline](img/cd-pipeline.png)

<!--

Gracias a CD, el software entregado debe funcionar siempre.

Todos los cambios que se incorporan en un _build_ pueden formar parte de un candidato a _release_.

Antiguamente, los cambios pequeños solían tener que esperar a que se completaran otros muchos antes de ser empaquetados en una release. Siguiendo ese modelo, se suponía que el software era incorrecto hasta que era validado por profesionales de QA. Todas las pruebas se realizaban después del desarrollo, la responsabilidad de la calidad recaía exclusivamente en el equipo de QA.

-->

---

### Continuous Deployment

Desplegar automáticamente el software en producción después de cada cambio.


![CDEP pipeline](img/cdep-pipeline.png)

<!--

La entrega es manual, el despliegue es automático.

-->

---

| 📙 | Definiciones |
| ----: | :---- |
| <emph>Build</emph> | compilar y ensamblar el código fuente en formato ejecutable o en un conjunto de artefactos para un entorno específico |
| <emph>Pipeline</emph> | conjunto automatizado y secuencial de procesos para ejecutar tareas específicas |
| <emph>Staging</emph> | entorno de prueba que replica el entorno de producción para realizar pruebas finales (con usuarios) antes del despliegue |
| <emph>Artefacto</emph> | resultado del _build_. Pueden ser binarios ejecutables, bibliotecas, paquetes de instalación, etc., necesarios para ejecutar la aplicación |
| <emph>Release</emph> | una versión específica y completa de una aplicación o software que se considera lista para ser distribuida y utilizada por los usuarios finales |

---

![bg 80%](img/cicd-jenkins.png)

---

## ¿Qué es Jenkins?

- Jenkins es un servidor de automatización de código abierto escrito en Java.

- Ayuda a automatizar el proceso de compilación, prueba e implementación de software.

- Se puede instalar a través de paquetes nativos, Docker o incluso ejecutarlo como una aplicación independiente.

- Se puede integrar con una gran cantidad de herramientas de desarrollo y pruebas a través de complementos.

---

## Descargar e instalar Jenkins en Docker

- Hay varias imágenes de Docker de Jenkins disponibles.

- Utiliza la imagen oficial recomendada https://hub.docker.com/r/jenkins/jenkins/ del repositorio Docker Hub. Esta imagen contiene la versión actual LTS de Jenkin

- Sin embargo, esta imagen no contiene Docker CLI, ni incluye plugins de Blue Ocean que se utilizan con frecuencia

- Vamos a realizar una instalación personalizada

Como requisito previo, debes tener instalado Docker

https://www.jenkins.io/doc/book/installing/docker/

---

## Instalación de Jenkins

Hay dos formas de instalar Jenkins usando Docker:
1. Usando el socket de Docker del host
2. Usando Docker in Docker (dind)

---

## Instalación de Jenkins (usando socket de Docker)

* Jenkins necesita acceso al socket de Docker del host para ejecutar comandos.
* Estos comandos se usarán en los pipelines de Jenkins para construir, ejecutar y administrar contenedores Docker.
* Permite usar el Docker del host como **agente de Jenkins** para ejecutar los pipelines.

El socket de Docker se encuentra en...
* En Linux, macOS o Windows con WSL: `/var/run/docker.sock`
* En Windows sin WSL: `//./pipe/docker_engine`

---

## Instalación de Jenkins (docker-compose.yml)

```yaml
services:
  jenkins:
    image: my-custom-jenkins
    build: .
    container_name: jenkins
    restart: unless-stopped
    ports:
      - "8080:8080" # Puerto para acceder a Jenkins
      - "50000:50000" # Puerto para agentes de Jenkins
    volumes:
      - jenkins_home:/var/jenkins_home # Persistencia de datos de Jenkins
      - /var/run/docker.sock:/var/run/docker.sock # Permite a Jenkins usar Docker del host
    environment:
      - DOCKER_HOST=unix:///var/run/docker.sock # Configura Jenkins para usar Docker del host

volumes:
  jenkins_home:
```

---

### Dockerfile (personaliza imagen oficial con Docker CLI y plugins)

```bash
FROM jenkins/jenkins:lts-jdk21
USER root
RUN apt-get update && apt-get install -y lsb-release
RUN curl -fsSLo /usr/share/keyrings/docker-archive-keyring.asc \
  https://download.docker.com/linux/debian/gpg
RUN echo "deb [arch=$(dpkg --print-architecture) \
  signed-by=/usr/share/keyrings/docker-archive-keyring.asc] \
  https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
RUN apt-get update && apt-get install -y docker-ce-cli
USER jenkins
RUN jenkins-plugin-cli --plugins \
    docker-workflow \
    workflow-aggregator \
    git \
    github \
    locale \
    blueocean
```

---

## Docker in Docker (dind)

![bg right:50% 100% Dind](img/docker-dind-min.png)

- La imagen dind (Docker in Docker) es una imagen de Docker que contiene Docker
- Crea un contenedor hijo dentro de otro contenedor Docker
- Contenedores e imágenes disponibles en el contenedor hijo

- Más compleja de configurar... pero (algo) más segura y portable.
- Acceso [privilegiado](https://docs.docker.com/engine/reference/run/#runtime-privilege-and-linux-capabilities) al host (¡cuidado!)

---

### Arquitectura DinD con Jenkins

- DinD se utiliza para ejecutar comandos de Docker dentro de los nodos de Jenkins

```txt
Host (macOS/Linux/Windows)
└── Contenedor jenkins-docker (docker:dind)  ← motor Docker "interno"
      └── Contenedor jenkins-blueocean       ← servidor Jenkins
            └── Pipelines que usan Docker    ← builds CI/CD
```

Los dos contenedores se comunican a través de una **red bridge** de Docker.

---

#### 1. Instalar imágenes de Docker

```bash
docker pull jenkins/jenkins
docker pull docker:dind
```

#### 2. Configurar la red

Crear una red de tipo bridge en Docker:

```bash
docker network create jenkins
```

<!--
Docker in Docker (dind) permite ejecutar un demonio Docker dentro de un contenedor Docker. Esto significa que el contenedor hijo tiene su propio motor Docker, con imágenes y contenedores aislados del host.

Se usa en Jenkins para que los agentes/nodos del pipeline puedan construir y ejecutar imágenes Docker sin depender del Docker del host directamente.
-->

---

## Instalación de Jenkins (usando Docker in Docker)

```yaml
services:
  docker:
    image: docker:dind
    container_name: jenkins-docker
    privileged: true
    restart: unless-stopped
    # Controlador de almacenamiento a utilizar (OMITIR EN WINDOWS):
    command: ["--storage-driver=overlay2"]
    environment:
      - DOCKER_TLS_CERTDIR=/certs # Habilita TLS para Docker
    volumes:
      - jenkins-docker-certs:/certs/client
      - jenkins-data:/var/jenkins_home
    ports:
      - "2376:2376" # Puerto para la API de Docker
      - "3000:3000" # Puerto para la aplicación React
    networks:
      jenkins:
        aliases:
          - docker
```

---

(`docker-compose.yml`) Servicio de Jenkins:

```yaml
jenkins:
    image: my-custom-jenkins
    build: .
    container_name: jenkins
    restart: on-failure
    depends_on:
      - docker
    environment:
      - DOCKER_HOST=tcp://docker:2376
      - DOCKER_CERT_PATH=/certs/client
      - DOCKER_TLS_VERIFY=1
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins-data:/var/jenkins_home
      - jenkins-docker-certs:/certs/client:ro
    networks:
      - jenkins
```

---

(`docker-compose.yml`) Volúmenes y redes:

```yaml
volumes:
  jenkins-data:
    name: jenkins-data
  jenkins-docker-certs:
    name: jenkins-docker-certs

networks:
  jenkins:
    name: jenkins
```

---

## Accediendo al contenedor de Docker

Levanta el contenedor de Jenkins usando `docker-compose`:

```bash
docker-compose up -d
```

Recuerda que puedes acceder a la terminal del contenedor y a los logs:

```bash
docker exec -it jenkins bash
docker logs jenkins
```

---

## Asistente de configuración

Después de instalar y ejecutar Jenkins podemos a un asistente de configuración a través de la interfaz web:

http://localhost:8080

Este asistente te guía para:
  - Desbloquear Jenkins
  - Instalar plugins
  - Crear el primer usuario administrador

Se puede forzar el idioma desde las opciones de *Apariencia*

---

## Crear un Pipeline (I)

Un pipeline es un conjunto de pasos que Jenkins ejecuta para compilar, probar y entregar software.

Un pipeline se define en un archivo de texto llamado `Jenkinsfile`.

1. Haz clic en **New Item** en el menú de la izquierda

2. Introduce un nombre para la tarea y selecciona **Pipeline**

3. Haz clic en **OK**

---

## Crear un Pipeline (II)

1. En la sección **Definition**, selecciona **Pipeline script**

2. Introduce el siguiente código en el editor:

```groovy
pipeline { // Declaración de pipeline
  agent any // Agente que ejecuta el pipeline
  
  stages { // Declaración de etapas
      stage('Stage 1') { // Declaración de etapa
          steps { // Declaración de pasos
              echo 'Hello world!' // Paso
          }
      }
  }
}
```

3. Haz clic en **Save**

---

## Ejecutar un Pipeline

1. Haz clic en **Build Now** en el menú de la izquierda

2. Haz clic en el número de compilación en la columna **Builds**

3. En la sección, **Console Output**, podemos ver la salida del pipeline

Debido a que personalizamos la imagen de Jenkins, también podemos usar la interfaz **Open Blue Ocean** (menú de la izquierda).

---

## Jenkinsfile

- Contiene la definición de un pipeline (usa lenguaje Groovy)
- Se puede almacenar en un repositorio de código fuente como GitHub y Bitbucket

```groovy
pipeline {
    agent {
        // Indica dónde se ejecutará el pipeline. Puede ser:
        // - cualquier agente disponible
        // - un agente concreto identificado por una etiqueta
        // - un contenedor Docker con una imagen determinada
    }
    environment {
        // Variables de entorno del pipeline
    }
    stages {
        // Etapas que componen el pipeline
    }
}
```

---

### Agentes (Ejemplos)

```groovy
pipeline {
    agent {
        label 'agente' // Nombre del agente de Jenkins
    }
}
```

Podemos ver los agentes de Jenkins disponibles en **Manage Jenkins** > **Nodes**.

También podemos indicar que el pipeline se ejecute en cualquier agente disponible:

```groovy
pipeline {
    agent any
}
```

* El propio servidor de Jenkins también puede actuar como agente.
* Se pueden configurar otras máquinas como agentes de Jenkins.

---

### Agentes (usando contenedores Docker)

Dind se utiliza para ejecutar comandos de Docker dentro de los nodos de Jenkins

```groovy
pipeline {
    agent {
        docker {
            image 'image' // Nombre de la imagen de Docker
            args 'args' // Argumentos para la imagen de Docker
        }
    }
}
```

También se puede usar un archivo Dockerfile que se encuentre en el repositorio:

```groovy
pipeline {
    agent { dockerfile true }
}
```

---

### Variables de entorno

<div class="cols">
<div>

Las variables de entorno se definen de la siguiente manera:

```groovy
pipeline {
    environment {
        key = 'value'
    }
}
```

</div>
<div>

- `key` es el nombre de la variable de entorno
- `value` es el valor de la variable de entorno

</div>
</div>

---

### Etapas

<div class="cols">
<div>

```groovy
pipeline {
    stages {
        stage('Stage 1') {
            steps {
                // Pasos de la etapa
                // ...
                // ...
            }
        }
    }
}
```

</div>
<div>

- Una **etapa** es una colección de pasos
  - Las etapas se ejecutan secuencialmente
  - Aunque hay opciones para ejecutarlas en paralelo
- Un **paso** es una acción que se ejecuta en un agente
  - Los pasos se ejecutan secuencialmente
  - Se usa `sh` para ejecutar comandos de shell

</div>
</div>

---

## Pipeline from SCM

Escribir y mantener pipelines complejas dentro del área de texto de la interfaz clásica de Jenkins puede ser complicado.

La alternativa para facilitar este proceso es escribir tu Jenkinsfile en un IDE y luego subirlo al control de código fuente.

---

### Crear Pipeline from SCM

1. Crea una nueva pipeline y selecciona **Pipeline script from SCM**.
2. En **SCM**, selecciona **Git**
3. En **Repository URL**, introduce la URL del repo y añade las credenciales necesarias para acceder al repositorio:
   - **Username**: nombre de usuario del repositorio
   - **Password**: Token de Acceso Personal (PAT)
   - **ID**: Nombre de la credencial

4. En **Script Path**, introduce el path del archivo Jenkinsfile
5. Haz clic en **Save**

---

## Pipeline para desplegar aplicación React

Vamos a crear un pipeline para desplegar una aplicación React en un contenedor Docker usando el repositorio:
https://github.com/jenkins-docs/simple-node-js-react-npm-app

Si has usado Docker in Docker (dind) para ejecutar Jenkins, debes publicar un puerto adicional en el contenedor Dind para Jenkins (Ya lo hicimos en el `docker-compose.yml`):

`--publish 3000:3000`

---

### Ejemplo: Pipeline para desplegar aplicación React (I)

1. Crear fork del repositorio que contiene la aplicación: https://github.com/jenkins-docs/simple-node-js-react-npm-app
2. Clonamos el repositorio en nuestro equipo
3. Creamos un archivo `Jenkinsfile` en el directorio raíz del repositorio
4. Creamos un pipeline en Jenkins con la opción **Pipeline script from SCM** y la siguiente configuración:
   - **SCM**: Git
   - **Repository URL**: URL del repositorio
   - **Credentials**: Crear credenciales de tipo "Username with password" con tu nombre de usuario de GitHub y token de acceso personal (PAT) del repositorio
   - **Script Path**: Jenkinsfile
   - **Branches to build**: */master

---

### Ejemplo: Pipeline para desplegar aplicación React (II)

Incluimos el siguiente código en el archivo `Jenkinsfile` y lo subimos al repositorio.

```groovy
pipeline {
    agent {
        docker {
            image 'node:22-alpine' // Imagen de Docker
            args '-p 3000:3000' // Puertos
        }
    }
    stages {
        stage('Build') { 
            steps {
                sh 'npm install' // Instalar dependencias
            }
        }
    }
}
```

---

### Ejemplo: Pipeline para desplegar aplicación React (III)

Volvamos a Jenkins y ejecutemos el pipeline.

1. Haz clic en **Build now** en el menú de la izquierda
2. Puedes ver el progreso del pipeline en la interfaz de usuario de Jenkins

Es posible que debas esperar varios minutos para que se complete esta primera ejecución

Después de clonar tu repositorio local, `Jenkins`:

- Coloca el proyecto en la cola para ejecutarse en el agente
- Descarga la imagen Docker de Node y la ejecuta en un contenedor

Una vez finalizada la ejecución, podemos ver el resultado en la interfaz de Jenkins.

---

### Ejemplo: Pipeline para desplegar aplicación React (IV)

Actualizamos el archivo `Jenkinsfile`:

```groovy
  stage('Test') { 
      steps {
          sh './jenkins/scripts/test.sh' 
      }
  }
```

- El Pipeline debe quedar lo más ordenado posible
- Los pasos de scripting de construcción más complejos se pueden colocar en archivos separados
- Esto facilita el mantenimiento del Pipeline, especialmente si adquiere más complejidad

Podemos volver a Jenkins y ejecutar el pipeline.

---

### Ejemplo: Pipeline para desplegar aplicación React (V)

Actualizamos el archivo `Jenkinsfile` con una etapa de Entrega/Despliegue:

```groovy
  stage('Deliver') {
      steps {
          sh './jenkins/scripts/deliver.sh'
          input message: 'Finished using the web site? (Click "Proceed" to continue)'
          sh './jenkins/scripts/kill.sh'
      }
  }
```

- El script `deliver.sh` entrega y despliega la aplicación en un contenedor Docker (más detalles dentro del script)
- `input message` detiene la ejecución y solicita respuesta al usuario

---

NOTA: Para que funcione correctamente, es necesario realizar un cambio en el script `deliver.sh` original:
* npm start & -->
* npm start -- --host 0.0.0.0

El puerto estaba publicado por Docker, pero la aplicación escuchaba solo en localhost **dentro del contenedor**.
Para que se pueda acceder desde el navegador del host, debe escuchar en 0.0.0.0.

---

### Ejemplo: Pipeline para desplegar aplicación React (V)

Finalmente, volvemos a ejecutar el pipeline y vemos el resultado en la interfaz de Jenkins.

Si accedemos a http://localhost:3000, podemos ver la aplicación React desplegada:

![width:400 center](img/react.png)

- Si accedemos al contenedor de Jenkins, podemos ver los archivos generados por el pipeline en el directorio `/var/jenkins_home/workspace/<nombre-del-pipeline>`
- Además, con el comando `docker ps` podemos ver el contenedor creado durante la ejecución del pipeline


# Ejercicio 1

Prueba a realizar el completo proceso de despliegue de la aplicación React usando el pipeline que acabamos de crear.

* Usa Docker in Docker (dind) para los agentes de Jenkins
* ¿Se puede considerar que este pipeline implementa CI, Continuous Delivery y/o Continuous Deployment? ¿Por qué?


# Ejercicio 2

Crea un pipeline para desplegar una aplicación Python forkeando el repositorio: https://github.com/jenkins-docs/simple-python-pyinstaller-app

Sigue los mismos pasos que hemos visto para la aplicación React, pero usando un pipeline adaptado a la aplicación Python:

https://github.com/jacaballero/simple-python-pyinstaller-app/blob/master/Jenkinsfile

- ¿Qué diferencia hay entre lo que generan los dos pipelines (React VS Python)?
- ¿Se puede considerar que este pipeline implementa CI, Continuous Delivery y/o Continuous Deployment? ¿Por qué?
