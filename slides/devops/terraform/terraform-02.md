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

## Objetivos de la práctica

1. Separar la configuración en varios archivos.
2. Utilizar `tfvars`, `locals` y `outputs`.
3. Separar entornos con `tfvars` alternativos.
4. Crear varios recursos con `count`.
5. Gestionar el estado con más seguridad.
6. Trabajar con módulos.

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
      version = "~> 3.6.2"
    }
  }
}

provider "docker" {} # Para Windows, añadir:  host = "npipe:////.//pipe//docker_engine"
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

El archivo `terraform.tfvars` permite definir valores concretos para las variables:

```ruby
project_name   = "iacdocker"
wordpress_port = 8090
```

---

## `locals` y `outputs.tf`

`locals`: derivados internos que no se pasan desde fuera (como las variables), sino que se calculan dentro del módulo. Evita repeticiones y mejora la legibilidad.

```ruby
locals {
  db_volume_name = "${var.project_name}-db-data"
}
```

`outputs` muestra información útil tras `apply`.

```ruby
output "wordpress_url" {
  value = "http://localhost:${var.wordpress_port}"
}
output "network_name" {
  value = docker_network.wp_net.name
}
```

---

## Infraestructura de ejemplo

Vamos a desplegar una pequeña aplicación compuesta por:

- un contenedor `drupal`
- un contenedor `mysql`

```text
drupal_terraform/
  providers.tf
  main.tf
  variables.tf
  terraform.tfvars
  outputs.tf
```

---

## Variables (`variables.tf`)

```ruby
variable "project" {
  description = "Nombre del proyecto"
  type        = string
  default     = "drupal-iac"
}

variable "drupal_host_port" {
  description = "Puerto en el host para acceder a Drupal"
  type        = number
  default     = 8080
}

variable "mysql_root_password" {
  description = "Password de root en MySQL"
  type        = string
  sensitive   = true # Oculta el valor en la salida de Terraform
}

variable "mysql_database" {
  description = "Nombre de la base de datos de Drupal"
  type        = string
  default     = "drupal"
}

variable "mysql_user" {
  description = "Usuario de la BD para Drupal"
  type        = string
  default     = "drupal"
}

variable "mysql_password" {
  description = "Password del usuario de la BD"
  type        = string
  sensitive   = true # Oculta el valor en la salida de Terraform
}
```

---

 ## Variables (`terraform.tfvars`)


```ruby
drupal_host_port = 8082
mysql_root_password = "root_secret_123"
mysql_database = "drupal"
mysql_user = "drupal"
mysql_password = "drupal_secret_123"
```

---

## Locals (`main.tf`)

```ruby
locals {
  mysql_name   = "${var.project}-mysql"
  drupal_name  = "${var.project}-drupal"
  network_name = "${var.project}-network"
}
```

---

## Red e Imágenes Docker (`main.tf`)

```ruby
resource "docker_network" "name" {
  name = local.network_name # local para evitar repetir la construcción del nombre
}

resource "docker_image" "mysql" {
  name = "mysql:8.0"
}

resource "docker_image" "drupal" {
  name = "drupal:10-apache"
}
```

* La red es necesaria para que los contenedores puedan comunicarse entre sí.
* Usar versiones concretas hace el despliegue más estable y reproducible.

---

## Contenedor Mysql (`main.tf`)

```ruby
resource "docker_container" "mysql" {
  name  = local.mysql_name
  image = docker_image.mysql.image_id

  env = [
    "MYSQL_ROOT_PASSWORD=${var.mysql_root_password}",
    "MYSQL_DATABASE=${var.mysql_database}",
    "MYSQL_USER=${var.mysql_user}",
    "MYSQL_PASSWORD=${var.mysql_password}",
  ]

  networks_advanced {
    name = docker_network.name.name
  }
}
```

---

## Contenedor Drupal (`main.tf`)

```ruby
resource "docker_container" "drupal" {
  name  = local.drupal_name
  image = docker_image.drupal.image_id

  ports {
    internal = 80
    external = var.drupal_host_port
  }
  networks_advanced {
    name = docker_network.name.name
  }
}
```

---

## Salida (`outputs.tf`)

```ruby
output "drupal_url" {
  description = "URL para acceder a Drupal"
  value = "http://localhost:${var.drupal_host_port}"
}

output "mysql_container_name" {
  description = "Nombre del contenedor MySQL"
  value = docker_container.mysql.name
}
```

Tras terraform apply, se mostrarán estas salidas con la información de acceso a Drupal y el nombre del contenedor MySQL.

---

## Dependencias y flujo de trabajo

Flujo habitual:

```bash
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
```

Así obtenemos una infraestructura descrita de forma declarativa.

---

## Consultar salidas y estado

Comandos útiles después de `apply`:

```bash
terraform output
terraform output drupal_url
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

## Múltiples recursos con `count`

`count` permite crear varias instancias similares.

```ruby
resource "docker_image" "nginx" {
  name = "nginx:alpine"
}

resource "docker_container" "replica" {
  count = 3
  name  = "nginx-${count.index}"
  image = docker_image.nginx.image_id

  ports {
    internal = 80
    external = 8080 + count.index
  }
}
```

Así tendríamos servicios accesibles en `8080`, `8081` y `8082`.

---

## Ejemplo con contenedor Drupal

```ruby
resource "docker_container" "drupal" {
  count = 3
  name  = "${local.drupal_name}-${count.index}"
  
  image = docker_image.drupal.image_id

  ports {
    internal = 80
    external = var.drupal_host_port + count.index
  }
  networks_advanced {
    name = docker_network.name.name
  }
}
```

Al configurar Drupal en una réplica, ¿estará configurado en el resto de contenedores?

---

## `depends_on`

En ocasiones puede ser útil expresar dependencias de forma explícita:

```ruby
resource "docker_container" "drupal" {
  ...
  depends_on = [docker_container.mysql]
}
```

Terraform deduce dependencias cuando un recurso usa atributos de otro... pero:
* Terraform no siempre ve una dependencia real, por ejemplo, si el contenedor Drupal se conecta a MySQL por la red, no lo detecta automáticamente.
* En algunos casos, como con `count`, puede no deducirla correctamente
* Incluso con `depends_on`, MySQL puede no estar listo

---

## Ejemplo con Drupal (`depends_on`)

```ruby
resource "docker_container" "drupal" {
  ...
  depends_on = [docker_container.mysql]
  restart = "unless-stopped"
}
```
* `depends_on` asegura que Terraform intente crear el contenedor Drupal solo después de crear el de MySQL, pero no garantiza que MySQL esté listo.
* `restart = "unless-stopped"` hace que el contenedor Drupal intente reiniciarse si MySQL no está listo, lo que mejora la resiliencia de la aplicación.

Un healthcheck en MySQL ayuda a saber cuándo la BD está realmente lista (healthy).

Terraform no espera automáticamente a ese estado: se necesita lógica extra (p. ej., restart/espera en Drupal, o usar Compose/orquestador que sí pueda esperar a healthy).


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

* Terraform se detiene con error cuando intenta borrar ese volumen y el volumen no se elimina.
* El destroy no se completa (evita borrar datos por accidente)
* Para eliminarlo hay que quitar `prevent_destroy` (o dejar el volumen fuera de Terraform).

---

## Gestión de estado

Comandos útiles para inspeccionar el estado:

```bash
terraform state list
terraform state show docker_container.drupal
```

Y recordatorio importante:

- no editar `terraform.tfstate` manualmente
- añadir `terraform.tfstate*` al `.gitignore`
- revisar siempre el `plan`

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
.
├─ providers.tf
├─ main.tf
├─ variables.tf
├─ terraform.tfvars
├─ outputs.tf
└─ modules/
   └─ nombre_modulo/
      ├─ main.tf
      ├─ variables.tf
      └─ outputs.tf
```

Después, el proyecto principal puede reutilizarlo tantas veces como necesite.

---

## Uso de un módulo (añadido en `main.tf`)

```ruby
module "phpmyadmin" {
  source = "./modules/phpmyadmin"

  network_name = docker_network.name.name
  db_host = local.mysql_name
  host_port = 8090
  container_name = "${var.project}-phpmyadmin"
}
```

* `source` indica la ruta al módulo
* Se pasan variables al módulo como argumentos (network_name, db_host, host_port, container_name)
* El módulo puede usar esas variables para configurar su propia infraestructura

---

## `main.tf` del módulo `phpmyadmin`:

```ruby
terraform {
  required_providers {
    docker = { # La versión y la configuración se gestionan desde el proyecto principal
      source = "kreuzwerker/docker"
    }
  }
}

resource "docker_image" "phpmyadmin" {
  name = "phpmyadmin:5-apache"
}
# Se usan argumentos recibidos para configurar el contenedor
resource "docker_container" "phpmyadmin" {
  name  = var.container_name
  image = docker_image.phpmyadmin.image_id
  ports {
    internal = 80
    external = var.host_port
  }
  networks_advanced {
    name = var.network_name
  }
  env = [
    "PMA_HOST=${var.db_host}",
    "PMA_PORT=${var.db_port}",
  ]
}
```

---

## Variables del módulo (`variables.tf`)

```ruby
variable "container_name" {
  type    = string
}

variable "host_port" {
  type    = number
  default = 8081
}

variable "network_name" {
  type = string
}

variable "db_host" {
  type = string
}

variable "db_port" {
  type    = number
  default = 3306
}
```

* El módulo define sus propias variables, que se pasan desde el proyecto principal.
* No tienen `default`, excepto `host_port` y `db_port`, para que el proyecto principal las configure explícitamente.

---

## Salidas del módulo (`outputs.tf`):

```ruby
output "url" {
  description = "URL para acceder a PhpMyAdmin"
  value = "http://localhost:${var.host_port}"
}
```

Se pueden utilizar desde el módulo principal con `module.phpmyadmin.url`:

```ruby
output "phpmyadmin_url" {
  value = module.phpmyadmin.url
}
```

---

## Cuándo modularizar

Los módulos son especialmente útiles cuando:

- Se repite el mismo patrón varias veces
- Ocultar detalles de implementación
- Reutilizar código entre prácticas o proyectos

No merece la pena modularizar todo desde el principio si la infraestructura aún es muy pequeña.

---

## Resumen

- Organización por archivos
- `locals`, `outputs` y `tfvars`
- Diferencia de entornos con `tfvars` alternativos
- Despliegue de múltiples recursos con `count`
- Gestión más segura del estado
- Módulos para reutilizar configuraciones

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
