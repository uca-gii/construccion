terraform {
  required_providers {
    docker = {
      source = "kreuzwerker/docker"
      version = "~> 3.6.2"
    }
  }
}

provider "docker" {}

resource "docker_image" "mariadb" {
  name         = "mariadb:latest"
  keep_locally = false
}

resource "docker_image" "wordpress" {
  name         = "wordpress:latest"
  keep_locally = false
}

resource "docker_volume" "mariadb_volume" {
  name = "mariadb_volume"
}

resource "docker_volume" "wordpress_volume" {
  name = "wordpress_volume"
}

resource "docker_network" "redDocker" {
  name = "redDockerTerraform"
}

resource "docker_container" "mariadb" {
  image = docker_image.mariadb.image_id
  name  = "${var.mariadb_container_name}"
  ports {
    internal = 3306
  }
  env = [
    "MARIADB_ROOT_PASSWORD=root",
    "MARIADB_DATABASE=wordpress",
    "MARIADB_USER=wordpress",
    "MARIADB_PASSWORD=wordpress"
  ]
  volumes {
    volume_name = docker_volume.mariadb_volume.name
    container_path = "/var/lib/mysql"
  }
  networks_advanced {
    name = docker_network.redDocker.name
    aliases = ["db"]
  }
}

resource "docker_container" "wordpress" {
  image = docker_image.wordpress.image_id
  name  = "wordpress"
  ports {
    internal = 80
    external = 8080
  }
  env = [
    "WORDPRESS_DB_HOST=${var.WORDPRESS_DB_HOST}",
    "WORDPRESS_DB_USER=${var.WORDPRESS_DB_USER}",
    "WORDPRESS_DB_PASSWORD=${var.WORDPRESS_DB_PASSWORD}",
    "WORDPRESS_DB_NAME=${var.WORDPRESS_DB_NAME}"
  ]
  volumes {
    volume_name = docker_volume.wordpress_volume.name
    container_path = "/var/www/html"
  }
  networks_advanced {
    name = docker_network.redDocker.name
  }
}