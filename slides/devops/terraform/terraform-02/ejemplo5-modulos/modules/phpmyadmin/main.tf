terraform {
  required_providers {
    docker = {
      source = "kreuzwerker/docker"
    }
  }
}

resource "docker_image" "phpmyadmin" {
  name = "phpmyadmin:5-apache"
}

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