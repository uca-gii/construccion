---
marp: true
title: Prácticas de Terraform para Infraestructura Docker
description: Asignatura de Virtualización de Sistemas
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

# Terraform para Infraestructura Docker

![width:640 center](img/Terraform_PrimaryLogo_Color_RGB.svg)

---

<!-- paginate: true -->

## Introducción a Terraform

Terraform es una herramienta de código abierto que permite __automatizar la implementación y gestión de infraestructura como código__ (IaC).

* __Automatización__: automatiza la creación, configuración y gestión de recursos de infraestructura, lo que ahorra tiempo y reduce errores

* __Declarativo__: estado de la infraestructura en vez de scripts

* __Replicabilidad__: archivos de configuración legibles y versionables

* __Orquestación__: coordina dependencias entre recursos de distintos proveedores (AWS, Azure, Kubernetes...)

* __Estado__: mantiene un estado de la infraestructura para gestionar cambios controlados

---

## Arquitectura de Terraform

![width:720 center](img/terraform_architecture.avif)

* Creación de los archivos Terraform (IaC)
* Plan: Vista previa de los cambios que Terraform realizará para que coincidan con tu configuración
* Apply: Se aplican los cambios planificados

---

## Uso de Terraform para Infraestructura Docker

Terraform permite crear y gestionar una infraestructura Docker completa: contenedores, imágenes, redes y volúmenes.

En esta práctica, se utilizará Terraform para crear y gestionar una infraestructura Docker.

![width:400 center](img/docker-010.png)

---

## Instalación de Terraform

https://developer.hashicorp.com/terraform/install

### Instalación de Terraform (Linux)

Según distribución en [Documentación Oficial](https://developer.hashicorp.com/terraform/install)

### Instalación de Terraform (MacOS)

```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
```

### Instalación de Terraform (Windows)

Instalación con [chocolatey](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli).

```shell
choco install terraform
```

---

## Creación de Infraestructura Docker con Terraform

Primero, crea un directorio de trabajo para tus prácticas de Terraform.

```bash
mkdir mi_proyecto_terraform
cd mi_proyecto_terraform
```

Vamos a crear un archivo de configuración `nginx.tf` para desplegar un contenedor Docker con Nginx.

---

## Creación de archivos de configuración (nginx.tf)

```ruby
terraform {
  required_providers {
    docker = {
      source = "kreuzwerker/docker"
      version = "~> 3.6.2"
    }
  }
}

provider "docker" {} # Para Windows, añadir:  host = "npipe:////.//pipe//docker_engine"

resource "docker_image" "nginx" {
  name         = "nginx:latest"
  keep_locally = false
}

resource "docker_container" "nginx" {
  image = docker_image.nginx.image_id
  name  = "practicas"
  ports {
    internal = 80
    external = 8080
  }
}
```

---

## Creación de archivos de configuración (proveedor)

```ruby
terraform {
  required_providers {
    docker = {
      source = "kreuzwerker/docker"
      version = "~> 3.6.2"
    }
  }
}
provider "docker" {} # Para Windows, añadir:  host = "npipe:////.//pipe//docker_engine"
```

* __terraform__: define la configuración de Terraform. Hemos especificado el proveedor de Docker y su versión (https://registry.terraform.io/providers/kreuzwerker/docker/latest/docs)
* Terraform instala los proveedores del Registro de Terraform ([Terraform Registry](https://registry.terraform.io/)) de forma predeterminada
* __provider__: permite configurar la conexión a Docker si es necesario

---

## Creación de archivos de configuración (recursos - images)

```ruby
resource "docker_image" "nginx" {
  name         = "nginx:latest"
  keep_locally = false  # Se elimina al destruir la infraestructura
}
```
* __resource__: crea una imagen Docker utilizando la imagen indicada (nginx). La imagen se descargará automáticamente si no existe localmente

El prefijo del tipo se relaciona con el nombre del proveedor. Terraform gestiona el recurso `docker_image` con el proveedor docker. El tipo y el nombre del recurso forman un ID único para el recurso (`docker_image.nginx`).

---

## Creación de archivos de configuración (recursos - containers)

```ruby
resource "docker_container" "nginx" {
  image = docker_image.nginx.image_id
  name  = "practicas"
  ports {
    internal = 80
    external = 8080
  }
}
```

* __resource__: contiene argumentos para configurar los recursos. `docker_container` crea un contenedor Docker utilizando la imagen anterior
* Además, realiza un mapeo de puertos para exponer el puerto `80` internamente como el puerto `8080` externamente

`terraform init` inicializará el directorio de trabajo con la nueva configuración.

---

## Creación de Infraestructura Docker con Terraform (init)

`terraform init` realiza varias tareas importantes:

- __Descarga de proveedores__: Terraform identifica y descarga los proveedores de recursos específicos que se utilizarán en tu configuración. Por ejemplo, si estás creando infraestructura Docker, Terraform descargará el proveedor de Docker.

- __Validación de la configuración__: Terraform verifica la sintaxis y la validez de tus archivos de configuración.

- Crea `.terraform.lock.hcl`: bloquea las versiones de los proveedores utilizados.

---

## Formateo y validación

`terraform fmt` actualiza automáticamente el formato de los archivos de configuración de Terraform según las convenciones de estilo.

```bash
terraform fmt
```

Terraform imprimirá los nombres de los archivos que modifique.

Puede comprobarse si la configuración es sintácticamente válida:

```bash
terraform validate
```

---

## Planificación de la creación de la infraestructura

Planificar cambios es una buena práctica para comprender __qué recursos se crearán o modificarán__ y cómo afectarán a la infraestructura.

La planificación te da una vista previa de los cambios que Terraform realizará.

```bash
terraform plan
```

Terraform escaneará tus archivos de configuración, evaluará la infraestructura actual y generará un plan detallado de los cambios propuestos.

---

## Creación de la infraestructura (I)

Aplicar los archivos de configuración del directorio actual:

```bash
terraform apply
```

- Terraform escaneará tus archivos de configuración, evaluará la infraestructura actual y __generará un plan detallado de los cambios propuestos__
- Esto incluirá la creación de nuevos recursos, actualizaciones de recursos existentes y la destrucción de recursos obsoletos si los hay
- La información mostrada es similar a la de `terraform plan`

---

## Creación de la infraestructura (II)

```plaintext
  # docker_image.nginx will be created
  + resource "docker_image" "nginx" {
      + id           = (known after apply)
      + keep_locally = false
      + latest       = (known after apply)
      + name         = "nginx:latest"
      + output       = (known after apply)
    }

Plan: 2 to add, 0 to change, 0 to destroy.
```

- `+` junto a docker_container.nginx indica que se creará este recurso
- Debajo, se muestran los atributos que se establecerán en el recurso
- Terraform solicitará confirmación antes de aplicar los cambios

---

## Creación de la infraestructura (III)

Terraform mostrará un __resumen__ de los recursos creados.

Podemos comprobar los contenedores creados con `docker ps` y acceder a la aplicación en http://localhost:8080.

Listar los recursos actuales:
  
```bash
terraform state list
```

__El archivo de estado de Terraform__ (`terrafor.tfstate`) se habrá __creado/actualizado__ con la información de los recursos creados.


---


## Estado de Terraform

`terraform.tfstate` __almacena información sobre la infraestructura__ que estás gestionando, incluidos los recursos que Terraform ha creado y su estado actual.

- Permite comprender la __diferencia entre la infraestructura deseada y la existente__
- Se almacena de __forma segura y puede ser compartido__ en un equipo
- Puede __contener información sensible__, como contraseñas (incluir en `.gitignore`)

Estado actual de la infraestructura:
```bash
terraform show
```

A continuación se muestra un ejemplo de estado de Terraform:
- Información sobre el recurso docker_container llamado my_container
- Incluye la imagen utilizada y los puertos expuestos

---

### Ejemplo de Estado de Terraform

```plaintext
# terraform.tfstate
{
  "version": 4,
  "terraform_version": "1.0.5",
  "serial": 1,
  "lineage": "4d4a0f63-80d7-4b48-9a92-09c4909d5e6b",
  "outputs": {},
  "resources": [
    {
      "module": "",
      "mode": "managed",
      "type": "docker_container",
      "name": "my_container",
      "provider": "provider[docker]",
      "instances": [
        {
          "schema_version": 2,
          "attributes": {
            "command": null,
            "image": "nginx:latest",
            "name": "mi-contenedor",
            "networking_type": "bridge,container:mi-contenedor",
            "ports": [
              {
                "external": 8080,
                "internal": 80,
                "ip": "0.0.0.0",
                "type": "tcp"
              }
            ],
            "volumes": []
          },
          "private": "hidden sensitive data"
        }
      ]
    }
  ]
}
```

---

## Modificación de la infraestructura

Modifica el archivo de configuración para cambiar el puerto externo a 8081:

```ruby
resource "docker_container" "nginx" {
  image = docker_image.nginx.image_id
  name  = "practicas"
  ports {
    internal = 80
    external = 8081
  }
}
```

Aplica los cambios con `terraform apply` y comprueba que el contenedor se ha recreado con el nuevo puerto http://localhost:8081.

- El prefijo `-`/`+` significa que Terraform destruirá y volverá a crear el recurso
- Terraform puede actualizar algunos atributos (prefijo `~`), pero cambiar el puerto de un contenedor requiere recrearlo

---

## Destrucción de la infraestructura

Cuando ya no necesites ciertos recursos puedes eliminar la infraestructura:

```bash
terraform destroy
```

- Se mostrará un __plan de destrucción__ similar al de `terraform plan` y se solicitará confirmación

- Tras confirmar, __se eliminarán los recursos__ de la infraestructura

- En el caso de Docker, los contenedores se eliminarán y las imágenes se eliminarán si no se utilizan en otros contenedores

---

## Archivo con Variables (I)

Las variables de Terraform permiten escribir configuraciones dinámicas y flexibles.

Las variables se pueden definir con un bloque `variable` en el mismo archivo de configuración (`nginx.tf`) o en un archivo separado `variables.tf`:

```ruby
variable "container_name" {
  description = "Value of the name for the Docker container"
  type        = string
  default     = "NginxContainer"
}
```

- El nombre de la variable es `container_name`
- La descripción es opcional, pero es una buena práctica incluirla
- El tipo de variable es `string`
- El valor predeterminado es `NginxContainer`

---

## Archivo con Variables (II)

Para utilizar la variable en el archivo de configuración, se utiliza la sintaxis `${var.container_name}`:

```ruby
resource "docker_container" "nginx" {
  image = docker_image.nginx.image_id
  name  = "${var.container_name}"
  ports {
    internal = 80
    external = 8081
  }
}
```

Aplica los cambios con `terraform apply` y comprueba que el contenedor se ha recreado con el nuevo nombre.

---

## Aplicación de Variables de Entorno

Si lo que queremos es añadir variables de entorno al contenedor Docker, podemos utilizar el atributo `env`:

```ruby
resource "docker_container" "nginx" {
  image = docker_image.nginx.image_id
  name  = "${var.container_name}"
  ports {
    internal = 80
    external = 8081
  }
  env = [
    "MY_ENV_VAR=my_env_value"
  ]
}
```

---

## Volúmenes de Docker

```ruby
resource "docker_volume" "my_volume" {
  name = "my_volume"
}
```

Para utilizar el volumen en un contenedor, se utiliza el bloque `volumes`:

```ruby
resource "docker_container" "nginx" {
  ...
  volumes {
    volume_name = docker_volume.my_volume.name
    container_path = "/usr/share/nginx/html"
  }
}
```

Cada volumen se define indicando el nombre del volumen y la ruta de montaje dentro del contenedor.

---

## Redes de Docker
  
```ruby
resource "docker_network" "my_network" {
  name = "my_network"
}
```

Para utilizar la red en un contenedor, se utiliza el bloque `networks_advanced`:

```ruby
resource "docker_container" "nginx" {
  ...
  networks_advanced {
    name = docker_network.my_network.name
    aliases = ["nginx"] # Opcional: alias del contenedor en la red
  }
}
```

Los contenedores pueden comunicarse entre sí en la misma red utilizando el nombre del contenedor o el alias.


# Ejercicio

1. Crea una infraestructura Docker personalizada utilizando Terraform.
2. La infraestructura debe contener un contenedor con una aplicación Wordpress y otro contenedor con una base de datos MariaDB.
3. Deben estar conectados a una red Docker creada desde Terraform.
4. Debe existir un volumen para almacenar los datos de la base de datos y otro para los archivos de Wordpress, ambos gestionados por Terraform.
5. Deben usarse variables de entorno para configurar la aplicación Wordpress.
6. Debe existir un archivo de configuración `variables.tf` con las variables de entorno.

