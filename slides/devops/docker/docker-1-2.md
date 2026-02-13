---
marp: true
title: Prácticas de Docker 01
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
</style>

# DOCKER - Parte 1

![width:480 center](img/docker-010.png)

---

<!-- paginate: true -->

## ¿Qué es Docker?

### Algunas definiciones:

1. Un entorno chroot (jaula de dependencias)
2. Contrato entre _sysadmin_  y  desarrollador
3. Empaquetador de aplicaciones
4. Un sistema de virtualización

---

## ¿Qué es Docker?

### 1. Un entorno _chroot_

Entorno aislado del sistema, donde se pueden instalar aplicaciones y librerías sin que afecte al sistema principal.

### 2. Contrato entre _sysadmin_  y desarrollador

El  administrador solo debe  __desplegar__  los contenedores, mientras que el  desarrollador puede trabajar e instalar con ellos sin poner en riesgo el sistema.

### 3. Empaquetador de aplicaciones

Se puede crear un  _container_ para la aplicación, de modo que se ejecuten igual en distintas máquinas.

---

## ¿Qué es Docker?

### 4. Un sistema de virtualización

__Virtual machine__: _Include the application, the necessary binaries and libraries, and an entire guest operating system –– all of which can amount to tens of GBs._

![Virtual machine](img/docker-011.png)

---

## Virtualización

__Container__: _Include the application and all of its dependencies –– but share the kernel with other containers, running as isolated processes in user space on the host operating system. Docker containers are not tied to any specific infrastructure: they run on any computer, on any infrastructure, and in any cloud._

![Container](img/docker-012.png)

---

## Virtualización de Docker

- Docker no solo virtualiza el hardware, también el sistema operativo.

- Docker es una tecnología de _código abierto_ para crear, ejecutar, probar e implementar aplicaciones distribuidas dentro de __contenedores__ de software

- Docker está basado en el sistema de virtualización de __Linux__ 

---

## Contenedores Docker

### ¿Qué es un contenedor?

- Los contenedores crean un __entorno virtual__ para las aplicaciones
- Ocupan  menos __espacio__  que una máquina virtual al no tener que almacenar el sistema completo.
- El tiempo de __arranque__ de un container  es inferior a 1 segundo.
- Para __integrar__ máquinas virtuales en un host, debemos establecer la red. En los contenedores de Docker la integración es directa. 

---

### Ventajas para desarrolladores

- __Dependencias__: Docker permite a los desarrolladores entregar servicios aislados, gracias a la eliminación de problemas de dependencias de ejecución del software.
- __Productividad__: Se  reduce el tiempo empleado en configurar los entornos o solucionar problemas relacionados con los mismos.
- __Despliegue__: Las aplicaciones compatibles con Docker se pueden desplegar desde equipos de desarrollo a versiones de producción.

---

## Instalación de Docker

- Trabajaremos con Ubuntu, aunque es posible en cualquier sistema operativo
- Docker solo trabaja con sistemas de 64 bits

### Instalación (Ubuntu)

Instrucciones de instalación:

https://docs.docker.com/engine/install/ubuntu/

Comprobar que se está ejecutando:

```bash
sudo docker --version
sudo service docker status
```

---

### Instalación (Windows)

- Docker está ya integrado en Windows 10, haciendo uso de Hyper-V
- Cuando se usa Docker no se puede utilizar __Virtual Box__, lo que puede significar un problema
- Tenemos la opción de deshabilitar Hyper-V. Para ello debemos ejecutar como administrador:

Apagar

```bash
bcdedit /set  hypervisorlaunchtype off
```

Encender

```bash
bcdedit /set hypervisorlaunchtype auto
```

---

## Usos sin necesidad de _sudo_ (opcional)

Para ejecutar el daemon de Docker y los contenedores sin ser superusuarios:

https://docs.docker.com/engine/security/rootless/

Creamos un grupo docker

`sudo groupadd docker`

Añadimos el usuario al grupo

`sudo usermod -aG docker $USER`

Cerramos sesión y volvemos a entrar

Comprobamos que se está ejecutando

`sudo service docker status`

---

## Comprobar la instalación

Vemos con qué versión estamos trabajando

`docker --version`

Lista de comandos

`docker`

Información del sistema

`docker info`

Descarga y ejecución de un contenedor básico

`docker run hello-world`

---

## Docker Hub

https://hub.docker.com/

Es un repositorio donde los usuarios de Docker pueden compartir las imágenes de los contenedores que han creado.

Existe una opción de pago para registro privado.

Tiene servicios automatizados [webhooks](https://docs.docker.com/docker-hub/webhooks/) y se puede integrar con Github y BitBucket.

---

## Docker Hub

Darse de alta como usuario

[https://hub.docker.com/](https://hub.docker.com/)

Iniciar sesión desde el terminal

`docker login`

Ver los repositorios locales descargados

`docker images`
> Tendremos el hello-world que hemos utilizado para comprobar que el servicio funcionaba

---

## Descargando de repositorios 

Buscar un repositorio

`docker search ubuntu`

Descargar la versión oficial

`docker pull ubuntu`

> Podemos usar opciones como `ubuntu:14.04`, `ubuntu:latest`, etc.

Ejecutamos el contenedor

`docker run ubuntu /bin/echo "Pues parece que funciona"`

 > Al ejecutar `run`, si la imagen no existiera en el repositorio local, se descarga antes

---

## Repositorios en ejecución

Ver los contenedores en ejecución

`docker ps`

> `CONTAINER ID` es el identificador del contenedor
> `IMAGE` es la imagen usada para crearlo
> `NAME` -- si no se especifica, Docker crea un nombre aleatorio

Ver los contenedores que se han creado

`docker ps -a`

Borrar una imagen

`docker rmi [nombre_imagen]`

---

## Trabajando en los contenedores

Poner nombre a un contenedor

`docker run -t -i --name myUbuntu ubuntu /bin/bash`

 `-t` incluye terminal dentro del contenedor
 `-i` se puede trabajar de manera interactiva

Para salir del terminal

`exit`

---

## Trabajando en los contenedores en ejecución

Poner nombre a un contenedor

```bash
docker run --name myUbuntu ubuntu /bin/bash \
    -c "while true; do echo hola mundo; sleep 1; done"
```

Vemos los contenedores que se están ejecutando

`docker ps`

Detenemos el contenedor

`docker stop [nombre contenedor]`

Borrar un contenedor

`docker rm [nombre_contenedor]`

---

## Trabajando en los contenedores ejecutando en segundo plano

Poner nombre a un contenedor

```
docker run -d --name myUbuntu ubuntu /bin/bash \
    -c "while true; do echo hola mundo; sleep 1; done"
```

 > **-d** significa que se trabaje en segundo plano_ 

Vemos los contenedores que se están ejecutando: `docker ps`

Podemos ver la salida de nuestro contenedor: `docker logs myUbuntu`

Detenemos el contenedor

`docker stop [nombre contendedor]`

Abrir terminal de un determinado contenedor

`docker exec -it myUbuntu /bin/bash`

---

## Trabajando con Docker

![w:640](img/docker-013.png)

---

## Opciones

Exportar un contenedor

`docker export myUbuntu > myUbuntu.tar`

Importar desde un fichero local

`docker import /path/to/latest.tar`

---

## Puertos

Si un servicio escucha en un puerto dentro del contenedor (p.ej. `80`), hay que mapearlo al host para acceder desde fuera.

Mapeo explícito:

`docker run -p PUERTO_HOST:PUERTO_CONTENEDOR IMAGEN`

Mapeo automático:

`docker run -P IMAGEN`

Ver el mapeo:

`docker ps`

---

## Ejemplo: servidor web

Ejecutar Nginx en background y mapear el puerto 80 del contenedor al 8080 del host:

```bash
docker run -d --name web -p 8080:80 nginx
```

Probar en el navegador: http://localhost:8080/

Comandos útiles:

`docker logs -f web`

`docker exec -it web /bin/bash`

`docker stop web`

`docker rm web`

---

## Inspección y limpieza

Ver detalles de un contenedor:

`docker inspect [nombre_contenedor]`

Ver uso de recursos:

`docker stats`

Eliminar contenedores parados:

`docker container prune`

Eliminar imágenes sin usar (con cuidado):

`docker image prune`

---

## Dockerfile: crear nuestras imágenes

https://docs.docker.com/build/building/best-practices/

Flujo de trabajo:

1. Crear un directorio con el código/ficheros de la app
2. Escribir un `Dockerfile`
3. Construir una imagen con `docker build`
4. Ejecutar un contenedor con `docker run`

---

## Comandos básicos de Dockerfile

__FROM:__   para definir la imagen base
__MAINTAINER:__    nombre o correo del mantenedor
__COPY:__   copiar un fichero o directorio a la imagen
__ADD:__   para copiar ficheros desde urls
__RUN:__   ejecutar un comando dentro del container
__CMD:__   comando por defecto cuando ejecutamos un container
__ENV:__   variables de entorno
__EXPOSE:__   para definir los puertos del contenedor
__VOLUME:__   para definir directorios de datos que quedan fuera de la imagen
__ENTRYPOINT:__   comando a ejecutar de forma obligatoria al correr una imagen
__USER:__   Usuario para RUN, CMD y ENTRYPOINT
__WORKDIR:__   directorio para ejecutar los comandos

---

## Ejemplo de Dockerfile (web estática)

Estructura:

```
mi-web/
  index.html
  Dockerfile
```

`Dockerfile`:

```dockerfile
FROM nginx
COPY index.html /usr/share/nginx/html/index.html
EXPOSE 80
```

---

## Construcción y ejecución

Construir la imagen:

`docker build -t usuario/mi-web:1.0 .`

Ejecutar el contenedor:

`docker run --rm -p 8080:80 usuario/mi-web:1.0`

Subir a Docker Hub (opcional):

```bash
docker login
docker push usuario/mi-web:1.0
```

---

<style scoped>
p {
  text-align: center;
  font-size: 125%;
  color: green;
}
</style>

## Tutorial de Docker

[https://docs.docker.com/get-started/](https://docs.docker.com/get-started/)

---

## Persistencia: Directorios enlazados y volúmenes

Se usan para gestionar la información con Docker cuando necesitamos:

- Compartir un __directorio__ entre múltiples contenedores.
- Compartir un __directorio__ entre el host y un contenedor.
- __Persistencia__: permite borrar los contenedores sin perder la información.

Opciones:

- __Directorios enlazados__ *(bind):* la información se guarda fuera de Docker en el host local.
- __Volúmenes__: la información se guarda usando Docker. Mejor para datos generados por los propios contenedores.

---

## Bind mount (Directorios enlazados)

Se montan en un  __path específico de la máquina local__  (fuera de Docker).

Ejemplo: Crear un directorio local con un `index.html` y montarlo dentro del contenedor.

```bash
mkdir p02
echo '<h1>Hola!</h1>' > p02/index.html

docker run -d --name web-bind -p 8081:80 \
  --mount type=bind,source="$(pwd)"/p02,target=/usr/share/nginx/html,readonly \
  nginx
```

Abrir http://localhost:8081/. Si eliminamos el contenedor, no perdemos el contenido:


```bash
docker stop web-bind
docker rm web-bind
docker run -d -P --name=web-bind-2 -p 8082:80 \
  --mount type=bind,source=`pwd`/p02,target=/usr/share/nginx/html nginx
```

---

## Volúmenes

- Se montan en un _path_ específico del contenedor
- El acceso a la información sólo puede realizarse a través de Docker

Ejemplo: Crear un volumen y usarlo como almacenamiento persistente:

```bash
docker volume create webdata

docker run -d --name web-vol-1 -p 8083:80 \
  --mount type=volume,source=webdata,target=/usr/share/nginx/html \
  nginx
```

Actualizar el contenido del volumen con `docker cp`:

```bash
echo '<h1>Hola desde volumen</h1>' > index.html
docker cp index.html web-vol-1:/usr/share/nginx/html/index.html
```

---

### Compartir volumen y borrado

Compartir el mismo volumen con otro contenedor:

```bash
docker run -d --name web-vol-2 -p 8084:80 \
  --mount type=volume,source=webdata,target=/usr/share/nginx/html \
  nginx
```

Para borrar un volumen, antes hay que parar y borrar los contenedores que lo usan:

```bash
docker stop web-vol-1 web-vol-2
docker rm web-vol-1 web-vol-2
docker volume rm webdata
```

Comprobar que se ha borrado con `docker volume ls`

---

## Configuraciones de red

- Permiten comunicación entre contenedores pertenecientes a una red a través del nombre del contenedor
- Permiten aislamiento con respecto a otros contenedores
- Un contenedor puede pertenecer a varias redes

Ver redes existentes:

`docker network ls`

---

###  Tipos de redes

Ver las redes existentes: `docker network ls`

```bash
$ docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
21c353b4b7a5   bridge    bridge    local
7a7abec15748   host      host      local
40157ecf9fcf   none      null      local
```

- **host** representa la red del propio equipo y haría referencia a `eth0`
- **bridge** representa la red `docker0` y a ella se conectan todos los contenedores por defecto 
- **none** significa que el contenedor no se incluye en ninguna red. Si verificamos esto con el comando `ifconfig` dentro del contenedor, veríamos que sólo tiene la interfaz de loopback `lo`

---

## Ejemplo de red (Ubuntu + ping)

Crear una red y dos contenedores:

```bash
docker network create redDocker

docker run -d --name Ubuntu1 --network redDocker ubuntu sleep infinity
docker run -d --name Ubuntu2 --network redDocker ubuntu sleep infinity
```

Entrar en `Ubuntu2` e intentar hacer ping a `Ubuntu1` (hay que instalarlo):

```bash
docker exec -it Ubuntu2 bash
apt update && apt install -y iputils-ping
ping -c 3 Ubuntu1
exit
```

---

## Ejemplo completo: WordPress + MariaDB

```bash
docker network create wordpress-network
docker volume create --name mariadb_data
docker volume create --name wordpress_data

docker run -d --name mariadb --env ALLOW_EMPTY_PASSWORD=yes \
  --env MARIADB_USER=bn_wordpress \
  --env MARIADB_DATABASE=bitnami_wordpress \
  --network wordpress-network \
  --volume mariadb_data:/bitnami/mariadb \
  bitnami/mariadb:latest

docker run -d --name wordpress -p 8085:8080 -p 8443:8443 \
  --env ALLOW_EMPTY_PASSWORD=yes \
  --env WORDPRESS_DATABASE_USER=bn_wordpress \
  --env WORDPRESS_DATABASE_NAME=bitnami_wordpress \
  --network wordpress-network \
  --volume wordpress_data:/bitnami/wordpress \
  bitnami/wordpress:latest
```

# Ejercicio 1: Apache server

1. Crear un contenedor con Apache Server 2 (buscar en Docker Hub)
2. Personalizar el contenedor. El servidor por defecto muestra en la página principal "It works!". Modificar este mensaje para que muestre un saludo personal: "Hello + (tu nombre y apellidos)!".
3. Configurarlo para que por defecto utilice el puerto 8082.
4. Subir la imagen del contenedor creado a Docker Hub. La imagen debe llamarse `apacheserver_p1`.


# Ejercicio 2: Nginx con red y volumen compartido

## Parte 1

1. Crear volumen compartido `volumenDocker`
2. Crear un contenedor de Nginx que use el volumen `volumenDocker`.
3. Modifique el contenido del fichero `index.html` incluyendo un saludo personal en lugar del texto por defecto.
4. Cree un segundo contenedor que también use el volumen `volumenDocker`.
5. Compruebe que puede acceder a `localhost:81` (primer contenedor) y `localhost:82` (segundo contenedor) y ver el contenido de `index.html`.

---

## Parte 2

1. Crear una nueva red `redDocker`.
2. Crear un contenedor de Ubuntu `Ubuntu1` conectado a redDocker.
3. Crear un contenedor de Ubuntu `Ubuntu2` sin conectarlo a redDocker.
3. Instalar los paquetes necesarios y hacer ping a `Ubuntu1` desde `Ubuntu2`. ¿Funciona? ¿Por qué?.
4. Buscar en la documentación cómo conectar un contenedor existente a una red y conectar `Ubuntu2` a la red `redDocker`.
5. Intentar de nuevo hacer ping a `Ubuntu1` desde `Ubuntu2`. ¿Funciona? ¿Por qué?.


# Ejercicio 3: Probar el wordpress creado

1. Acceder a `http://localhost:8085/wp-admin/` para administrar WordPress (buscar usuario y contraseña en la documentación)
2. Crear una nueva página desde Pages > Add New Page
3. Acceder a `http://localhost:8085/` para ver la página creada
4. Borrar los contenedores creados y comprobarlo en el navegador
5. Crear de nuevo los contenedores. ¿La página sigue existiendo? ¿Por qué?
6. Borrar los contenedores y los volúmenes creados
7. Crear de nuevo los contenedores y los volúmenes. ¿La página sigue existiendo? ¿Por qué?