provider "google-beta" {
  credentials = "${var.credentials}"
  project     = "${var.project}"
  region      = "${var.region}"
}

resource "google_container_cluster" "primary" {
  provider           = "google-beta"
  name               = "graceful-shutdown-poc"
  location           = "${var.gke_location}"
  initial_node_count = 3

  master_auth {
    username = ""
    password = ""

    client_certificate_config {
      issue_client_certificate = false
    }
  }

  addons_config {
    horizontal_pod_autoscaling {
      disabled = true
    }

    http_load_balancing {
      disabled = true
    }

    kubernetes_dashboard {
      disabled = true
    }
  }

  node_config {
    machine_type = "g1-small"

    metadata = {
      disable-legacy-endpoints = "true"
    }

  }

  timeouts {
    create = "30m"
    update = "40m"
  }
}
