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
