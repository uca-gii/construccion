terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
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