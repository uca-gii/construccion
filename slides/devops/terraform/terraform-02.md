---
marp: true
title: Prácticas de Terraform para Infraestructura Docker II
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

# Terraform para Infraestructura Docker II

![width:640 center](img/Terraform_PrimaryLogo_Color_RGB.svg)

---

<!-- paginate: true -->

## Continuación de la práctica anterior

En la primera sesión se han visto los conceptos básicos:

- proveedor `docker`
- recursos `docker_image`, `docker_container`, `docker_volume` y `docker_network`
- flujo `init` / `plan` / `apply` / `destroy`
- variables y estado de Terraform

En esta segunda práctica profundizaremos en cómo __organizar__, __parametrizar__ y __reutilizar__ configuraciones Terraform.

---

## Objetivos

Al finalizar esta práctica deberías ser capaz de:

1. Separar la configuración en varios archivos.
2. Utilizar `tfvars`, `locals` y `outputs`.
3. Crear varios recursos con `count` y `for_each`.
4. Trabajar con módulos.
5. Gestionar el estado con más seguridad.

---

## Estructura recomendada del proyecto

```text
mi_proyecto_terraform/
  providers.tf
  main.tf
  variables.tf
  terraform.tfvars
  outputs.tf
```

Terraform carga automáticamente todos los archivos `*.tf` del directorio actual.

---

## `providers.tf`

```ruby
terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.1"
    }
  }
}

provider "docker" {}
```

Separar este bloque ayuda a localizar rápidamente la versión del proveedor y su configuración.

---

## `variables.tf` y `terraform.tfvars`

```ruby
variable "project_name" {
  type    = string
  default = "practica-tf"
}

variable "wordpress_port" {
  type    = number
  default = 8080
}
```

```ruby
project_name   = "iacdocker"
wordpress_port = 8090
```

---

## `outputs.tf` y `locals`

```ruby
locals {
  db_volume_name = "${var.project_name}-db-data"
}

output "wordpress_url" {
  value = "http://localhost:${var.wordpress_port}"
}

output "network_name" {
  value = docker_network.wp_net.name
}
```

`locals` evita repeticiones y `outputs` muestra información útil tras `apply`.

---

## Infraestructura de ejemplo

Vamos a desplegar una pequeña aplicación compuesta por:

- una red Docker
- un volumen persistente
- un contenedor `mariadb`
- un contenedor `wordpress`

Es un ejemplo sencillo, pero suficientemente realista para practicar conceptos más avanzados.

---

## Red y volumen

```ruby
resource "docker_network" "wp_net" {
  name = "${var.project_name}-net"
}

resource "docker_volume" "db_data" {
  name = local.db_volume_name
}
```

La red conecta los contenedores y el volumen conserva los datos de MariaDB.

---

## Imágenes Docker con versión fija

```ruby
resource "docker_image" "wordpress" {
  name         = "wordpress:6.4-apache"
  keep_locally = true
}

resource "docker_image" "mariadb" {
  name         = "mariadb:11.1"
  keep_locally = true
}
```

Usar versiones concretas hace el despliegue más estable y reproducible.

---

## Contenedor MariaDB

```ruby
resource "docker_container" "mariadb" {
  name  = "${var.project_name}-db"
  image = docker_image.mariadb.image_id

  env = [
    "MARIADB_ROOT_PASSWORD=changeme",
    "MARIADB_DATABASE=wordpress",
    "MARIADB_USER=wpuser",
    "MARIADB_PASSWORD=wppass"
  ]

  volumes {
    volume_name    = docker_volume.db_data.name
    container_path = "/var/lib/mysql"
  }

  networks_advanced {
    name = docker_network.wp_net.name
  }
}
```

---

## Contenedor Wordpress

```ruby
resource "docker_container" "wordpress" {
  name  = "${var.project_name}-wp"
  image = docker_image.wordpress.image_id

  env = [
    "WORDPRESS_DB_HOST=${docker_container.mariadb.name}:3306",
    "WORDPRESS_DB_USER=wpuser",
    "WORDPRESS_DB_PASSWORD=wppass",
    "WORDPRESS_DB_NAME=wordpress"
  ]

  ports {
    internal = 80
    external = var.wordpress_port
  }

  networks_advanced {
    name = docker_network.wp_net.name
  }
}
```

---

## Dependencias y flujo de trabajo

Terraform detecta dependencias implícitas cuando un recurso hace referencia a otro.

Flujo habitual:

```bash
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
```

Así obtenemos una infraestructura más compleja, pero descrita de forma declarativa.

---

## Consultar salidas y estado

Comandos útiles después de `apply`:

```bash
terraform output
terraform output wordpress_url
terraform show
terraform state list
```

Permiten inspeccionar lo que Terraform ha creado y qué valores expone la configuración.

---

## Ficheros `tfvars` alternativos

Podemos mantener varios conjuntos de valores:

```text
dev.tfvars
test.tfvars
prod.tfvars
```

Uso:

```bash
terraform apply -var-file="dev.tfvars"
```

Es útil para reutilizar la misma configuración en varios entornos.

---

## Workspaces

Otra forma de separar entornos es utilizar distintos workspaces:

```bash
terraform workspace list
terraform workspace new dev
terraform workspace new test
terraform workspace select dev
```

Cada workspace mantiene su propio estado.

---

## Ejemplo de uso de workspace

```ruby
locals {
  env_name = terraform.workspace
}

resource "docker_network" "wp_net" {
  name = "${var.project_name}-${local.env_name}-net"
}
```

Con el mismo código podemos obtener recursos distintos para `dev` y `test`.

---

## Múltiples recursos con `count`

`count` permite crear varias instancias similares.

```ruby
resource "docker_image" "nginx" {
  name         = "nginx:alpine"
  keep_locally = true
}

resource "docker_container" "replica" {
  count = 3
  name  = "nginx-${count.index}"
  image = docker_image.nginx.image_id
}
```

---

## `count` con puertos distintos

```ruby
resource "docker_container" "replica" {
  count = 3
  name  = "${var.project_name}-nginx-${count.index}"
  image = docker_image.nginx.image_id

  ports {
    internal = 80
    external = 8080 + count.index
  }
}
```

Así tendríamos servicios accesibles en `8080`, `8081` y `8082`.

---

## Múltiples recursos con `for_each`

`for_each` es mejor cuando cada instancia tiene una identidad propia.

```ruby
variable "web_ports" {
  type = map(number)
  default = {
    web1 = 8080
    web2 = 8081
    web3 = 8082
  }
}
```

Cada clave del mapa representará un recurso distinto.

---

## Ejemplo con `for_each`

```ruby
resource "docker_container" "web" {
  for_each = var.web_ports

  name  = each.key
  image = docker_image.nginx.image_id

  ports {
    internal = 80
    external = each.value
  }
}
```

La ventaja es que Terraform identifica cada recurso por su clave (`web1`, `web2`, `web3`).

---

## `count` o `for_each`

- `count`: recursos casi idénticos, diferenciados por índice
- `for_each`: recursos con nombre o clave significativa

En general:

- usa `count` para series simples
- usa `for_each` cuando la identidad del recurso importa

---

## `depends_on`

En ocasiones puede ser útil expresar dependencias de forma explícita:

```ruby
resource "docker_container" "wordpress" {
  ...
  depends_on = [docker_container.mariadb]
}
```

No suele hacer falta si ya existe una referencia directa, pero puede ayudar a documentar la relación.

---

## `lifecycle` y protección de datos

```ruby
resource "docker_volume" "db_data" {
  name = local.db_volume_name

  lifecycle {
    prevent_destroy = true
  }
}
```

Esta técnica evita eliminar por accidente volúmenes con datos persistentes.

---

## Gestión de estado

Comandos útiles para inspeccionar el estado:

```bash
terraform state list
terraform state show docker_container.wordpress
```

Y recordatorio importante:

- no editar `terraform.tfstate` manualmente
- añadir `terraform.tfstate*` al `.gitignore`
- revisar siempre el `plan`

---

## Importar recursos existentes

Terraform puede empezar a gestionar recursos ya creados fuera de Terraform:

```bash
terraform import docker_container.wordpress ID_DEL_CONTENEDOR
```

Después del `import`, la configuración `*.tf` debe ajustarse para reflejar fielmente el recurso importado.

---

## Módulos

Un módulo es un conjunto reutilizable de archivos Terraform.

Se usa para encapsular soluciones repetidas, por ejemplo:

- un contenedor web reutilizable
- una red común
- un servicio con volumen persistente

---

## Estructura de un módulo

```text
modules/
  web_container/
    main.tf
    variables.tf
    outputs.tf
```

Después, el proyecto principal puede reutilizarlo tantas veces como necesite.

---

## Uso de un módulo

```ruby
module "frontend" {
  source         = "./modules/web_container"
  container_name = "frontend"
  external_port  = 8080
  image_name     = "nginx:alpine"
}

module "backend" {
  source         = "./modules/web_container"
  container_name = "backend"
  external_port  = 8081
  image_name     = "httpd:alpine"
}
```

---

## Variables y salidas de un módulo

```ruby
variable "container_name" { type = string }
variable "external_port"  { type = number }
variable "image_name"     { type = string }

output "url" {
  value = "http://localhost:${var.external_port}"
}
```

Desde el proyecto principal podríamos acceder a `module.frontend.url`.

---

## Cuándo modularizar

Los módulos son especialmente útiles cuando:

- repites el mismo patrón varias veces
- quieres ocultar detalles de implementación
- buscas reutilizar código entre prácticas o proyectos

No merece la pena modularizar todo desde el principio si la infraestructura aún es muy pequeña.

---

## Flujo de trabajo recomendado

1. Diseñar primero una versión pequeña.
2. Separar la configuración por responsabilidad.
3. Parametrizar con variables y `tfvars`.
4. Añadir salidas útiles.
5. Reutilizar con `count`, `for_each` o módulos.
6. Proteger recursos sensibles y revisar el estado.

---

## Resumen

En esta segunda práctica se ha avanzado desde una configuración básica hacia otra más mantenible:

- organización por archivos
- `locals`, `outputs` y `tfvars`
- despliegue de múltiples recursos
- workspaces y módulos
- gestión más segura del estado

Esto permite construir infraestructuras Docker más realistas con Terraform.


# Ejercicio 1

Crea una infraestructura Docker con Terraform que cumpla lo siguiente:

1. Debe desplegar __tres contenedores Nginx__.
2. Deben publicarse en los puertos `8080`, `8081` y `8082`.
3. La configuración debe usar `count` o `for_each`.
4. Debe existir al menos un `output` que muestre las URL de acceso.
5. Debe utilizarse un archivo `terraform.tfvars` para definir puertos o nombres.


# Ejercicio 2

Diseña una infraestructura reutilizable con Terraform que incluya:

1. Un __módulo__ para desplegar un contenedor web.
2. Dos instancias de ese módulo con nombres y puertos diferentes.
3. Una red Docker común para ambos contenedores.
4. Un volumen persistente para uno de los servicios.
5. Protección del volumen mediante `lifecycle { prevent_destroy = true }`.
6. Un conjunto de salidas finales con los nombres de los contenedores y sus URLs.
