variable "mariadb_container_name" {
  description = "MariaDB container name"
  type        = string
  default     = "mariadb"
}

variable "WORDPRESS_DB_HOST" {
  description = "Database host"
  type        = string
  default     = "db"
}

variable "WORDPRESS_DB_USER" {
  description = "Database user"
  type        = string
  default     = "wordpress"
}

variable "WORDPRESS_DB_PASSWORD" {
  description = "Database password"
  type        = string
  default     = "wordpress"
}

variable "WORDPRESS_DB_NAME" {
  description = "Database name"
  type        = string
  default     = "wordpress"
}