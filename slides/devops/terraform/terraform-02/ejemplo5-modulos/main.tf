locals {
  mysql_name   = "${var.project}-mysql"
  drupal_name  = "${var.project}-drupal"
  network_name = "${var.project}-network"
}

resource "docker_network" "name" {
  name = local.network_name
}

resource "docker_image" "mysql" {
  name = "mysql:8.0"
}

resource "docker_image" "drupal" {
  name = "drupal:10-apache"
}

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

module "phpmyadmin" {
  source = "./modules/phpmyadmin"

  network_name = docker_network.name.name
  db_host = local.mysql_name
  host_port = 8090
  container_name  =  "${var.project}-phpmyadmin"
}

