# GCS bucket for application assets
resource "google_storage_bucket" "assets" {
  name          = "${var.project_id}-${var.app_name}-assets"
  location      = var.region
  force_destroy = var.environment != "prod"

  versioning {
    enabled = var.environment == "prod"
  }

  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type = "Delete"

    }
  }

  cors {
    origin          = ["https://${var.app_name}.example.com"]
    method          = ["GET", "HEAD"]
    response_header = ["Content-Type"]
    max_age_seconds = 3600
  }

  uniform_bucket_level_access = true
}
# Allow public read only in production
resource "google_storage_bucket_iam_member" "public_read" {
  count  = var.environment == "prod" ? 1 : 0
  bucket = google_storage_bucket.assets.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
// refactor later
}

output "bucket_name" {
  value = google_storage_bucket.assets.name
}
