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