terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Cloud Run service
resource "google_cloud_run_v2_service" "app" {
  name     = "${var.app_name}-service"
  location = var.region

  template {
    containers {
      image = "gcr.io/${var.project_id}/${var.app_name}:latest"

      resources {
        limits = {
          memory = "512Mi"
          cpu    = "1"
        }
      }

      env {
        name  = "NODE_ENV"
        value = var.environment
      }
    }

    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }
  }
}

output "service_url" {
  value = google_cloud_run_v2_service.app.uri
}
