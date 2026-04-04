---
marp: true
title: Prácticas de Jenkins (Parte 2)
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

# CI/CD con Jenkins (Parte 2)

![width:300 center](img/jenkins.svg)

---

<!-- paginate: true -->

## Objetivos de esta sesión

- Repasar cómo se organiza el trabajo en Jenkins
- Ampliar el `Jenkinsfile` con bloques útiles en proyectos reales
- Ver cómo usar `Dockerfile`
- Preparar un pipeline para generar artefactos con Marp

---

## Recordatorio de la sesión anterior

Partíamos de un pipeline declarativo con:

- `agent`
- `stages`
- `steps`
- scripts externos para tareas más largas

En esta sesión vamos a añadir principalmente:

- `options`
- `triggers`
- `parameters`
- `environment`
- archivado de artefactos

---

## Trabajo o *job* en Jenkins

Un <emph>trabajo</emph> (*job*) es una tarea configurable que Jenkins puede ejecutar.

Ejemplos:

- compilar una aplicación
- ejecutar tests
- generar documentación
- construir una imagen Docker
- crear un PDF con Marp

Un pipeline es un tipo de job.

---

## Estructura habitual de un Jenkinsfile

```groovy
pipeline {
    agent any
    options { }
    triggers { }
    parameters { }
    environment { }

    stages {
        stage('Build') { steps { } }
        stage('Test') { steps { } }
        stage('Package') { steps { } }
    }
}
```

No todos los bloques son obligatorios, pero pueden ser muy útiles para controlar el comportamiento del pipeline.

---

## `options`

Sirve para definir el comportamiento general del pipeline.

```groovy
options {
    timeout(time: 20, unit: 'MINUTES')
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '10'))
}
```

- `timeout`: evita ejecuciones colgadas
- `disableConcurrentBuilds()`: impide solapamientos
- `buildDiscarder(...)`: limita histórico y consumo de disco

---

## `triggers`

Permite ejecutar el pipeline automáticamente.

```groovy
triggers {
    pollSCM('H/5 * * * *')
}
```

- `pollSCM(...)` usa una expresión de tipo cron
- Los 5 campos significan: `minuto hora dia-del-mes mes dia-de-la-semana`
- `H/5 * * * *` significa: revisar cada 5 minutos
<!--- La `H` viene de *hash* y Jenkins la reparte automáticamente para no lanzar todos los jobs a la vez-->

---

## `triggers` VS webhooks

Un webhook es una notificación que un servicio externo (como GitHub) envía a Jenkins cuando ocurre un evento (como un push).

- con `pollSCM`, Jenkins pregunta periódicamente al repositorio si hay cambios
- con webhook, el repositorio avisa a Jenkins en cuanto recibe un push

- el webhook es más inmediato y eficiente, pero requiere configuración adicional
- `pollSCM` es más sencillo de configurar y puede ser adecuado cuando no se necesita una respuesta inmediata o el repositorio no soporta webhooks...
    - ...aunque también puede generar más carga en el servidor

---

## `parameters`

Los parámetros permiten reutilizar un mismo pipeline en distintos escenarios.

```groovy
parameters {
    string(name: 'APP_VERSION', defaultValue: '1.0.0', description: 'Version a empaquetar')
    choice(name: 'TARGET_ENV', choices: ['dev', 'staging', 'prod'], description: 'Entorno destino')
}
```

Después se accede con `params.APP_VERSION` o `params.TARGET_ENV`.

---

## Credenciales en Jenkins

Nunca debemos escribir valores sensibles directamente en el `Jenkinsfile`.

Jenkins permite almacenar credenciales como:

- usuario y contraseña
- token
- clave SSH
- texto secreto

Ejemplo:

```groovy
environment {
    GITHUB_TOKEN = credentials('github-token')
}
```

---

## Artefactos

Un artefacto es un resultado generado por el pipeline.

Ejemplos:

- un `.jar`, imagen Docker, un ejecutable, un `.pdf`, etc.

En Jenkins podemos guardar artefactos con:

```groovy
archiveArtifacts artifacts: 'pdf/*.pdf', fingerprint: true
```

- `'pdf/*.pdf'` indica el directorio y el patrón de ficheros a guardar
- `fingerprint: true` sirve para rastrear artefactos entre builds y jobs
<!--Para saber de dónde sale un artefacto y en qué ejecuciones se ha usado o reutilizado.-->

---

## Agentes con Docker

Jenkins puede ejecutar un pipeline dentro de un contenedor Docker.

```groovy
agent {
    docker {
        image 'node:22-alpine'
    }
}
```

Ventajas:

- entorno reproducible
- dependencias controladas
- menos diferencias entre equipos

---

## Agentes con `dockerfile`

También podemos construir el entorno desde un `Dockerfile` del repositorio.

```groovy
agent {
    dockerfile true
}
```

Esto es útil cuando la imagen base estándar no trae todas las herramientas necesarias.

---

## Ruta concreta para el Dockerfile

Si el `Dockerfile` no está en la raíz, podemos indicar su ubicación:

```groovy
agent {
    dockerfile {
        filename 'Dockerfile'
        dir 'ci/marp'
    }
}
```

En este caso Jenkins construye la imagen usando `ci/marp/Dockerfile`.

También se puede indicar el directorio y el nombre solo con el filename (`ci/marp/Dockerfile`)

---

## Buenas prácticas para el Jenkinsfile

- Mantener el `Jenkinsfile` pequeño y legible
- Mover lógica compleja a scripts del repositorio
- Versionar siempre el pipeline junto al código
- Fijar imágenes y herramientas con versiones concretas
- Fallar rápido cuando falten dependencias o credenciales
- Guardar los resultados importantes como artefactos

---

## Errores frecuentes

| Problema | Causa habitual |
| ----: | :---- |
| No encuentra `Jenkinsfile` | `Script Path` incorrecto |
| Falla `docker` | Jenkins no tiene acceso al motor Docker |
| No clona el repo | credenciales incorrectas o sin permisos |



# Ejercicio

Crear un pipeline para generar un PDF de Marp a partir de un repositorio con diapositivas.

- Checkout desde SCM (crear repo en `uca-iiss`)
- Generación y archivado del PDF resultante
- `options` vistas en la sesión
- `triggers` para ejecutar el pipeline automáticamente
- `parameters` para saber el nombre del archivo markdown a procesar

Etapas esperadas:
- Instalación de dependencias
- Generación del PDF
- Archivado del artefacto

---

## Dockerfile para el ejercicio

Podéis usar este `Dockerfile`:

```dockerfile
FROM node:22-bookworm

USER root

RUN apt-get update && apt-get install -y chromium && rm -rf /var/lib/apt/lists/*

ENV CHROME_PATH=/usr/bin/chromium

USER node
```

---

## Pistas para el ejercicio

- Configura el job como **Pipeline script from SCM**
- Usa un agente basado en `Dockerfile`
- Si el `Dockerfile` no está en la raíz, indica su ruta en `agent { dockerfile { ... } }`
- Genera el PDF en una carpeta como `pdf/`
- Publica el resultado con `archiveArtifacts`

<!--Pregunta: ¿tiene sentido añadir aquí despliegue automático? ¿Por qué?-->
