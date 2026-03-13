output "drupal_url" {
  description = "URL para acceder a Drupal"
  value = "http://localhost:${var.drupal_host_port}"
}

output "mysql_container_name" {
  description = "Nombre del contenedor MySQL"
  value = docker_container.mysql.name
}

output "phpmyadmin_url" {
  value = module.phpmyadmin.url
}