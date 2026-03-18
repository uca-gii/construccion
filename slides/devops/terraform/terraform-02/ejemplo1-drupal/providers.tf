terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.6.2"
    }
  }
}

provider "docker" {} # Para Windows, añadir:  host = "npipe:////.//pipe//docker_engine"