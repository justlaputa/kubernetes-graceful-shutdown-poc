# About

This repo is a prove of concept to show how to do graceful shutdown properly in Kubernetes. For the whole story, see my [medium post](https://blog.laputa.io/graceful-shutdown-in-kubernetes-85f1c8d586da)

It contains:
- Terraform code to provision a 3 node GKE cluster
- A nodejs callee app, provide an HTTP API endpoint on /api
- A nodejs caller app, calls the callee's API at a certain request rate
- Skaffold configuration to deploy those two nodejs apps into Kubernetes

## Pre-request

- [terraform](https://learn.hashicorp.com/terraform/getting-started/install.html)
- [gcloud sdk](https://cloud.google.com/sdk/install)
- [skaffold](https://skaffold.dev/docs/getting-started/)

## How to run it

### provision a GKE cluster

> Warning: this step will create a 3 node Kubernetes cluster on GKE. The instance type is `g1-small` (preemptible), about $0.021/hour in region us-centra1

copy the sample terraform variables file, and fillin your configurations

```bash
cd terraform
cp variables.tf.sample variables.tf
# add your GCP credential and project names, etc
vim variables.tf

terraform apply
```

### deploy nodejs applications

before run sakffold, you need to use glcoud get the kubernetes credential for local kubectl:

(you can get this command from GKE web ui as well)

```bash
gcloud container clusters get-credentials graceful-shutdown-poc --zone <ZONE> --project <GCP_PROJECT>
```

now run skaffold to build the docker image and deploy them:
```bash
skaffold run
```

### trigger rolling update

to test the graceful shutdown, there is a convinient script to trigger rolling update, without changing the container image:

```bash
./trigger-rolling-upgrade.sh
```

this script simply use the `kubectl set env` command to set a random environment variable for callee, which will trigger a rolling update.

You can also add one parameter to the script, to change the WAIT_TIME_BEFORE_CLOSE of callee app:

```bash
./trigger-rolling-upgrade.sh 8
```

this will change the waiting time to 8s.

### check the logs

Go to GCP console [Logging Viewer](https://console.cloud.google.com/logs/viewer) page, choose the GKE container log, you can filter by service name as well.

## Branches

there are 3 branches demostrate 3 cases:

- [v1](https://github.com/justlaputa/kubernetes-graceful-shutdown-poc/tree/v1): shutdown immediately after receiving `SIGTERM`
- [v2](https://github.com/justlaputa/kubernetes-graceful-shutdown-poc/tree/v2): wait for 10s before close server after receiving `SIGTERM`
- [readiness](https://github.com/justlaputa/kubernetes-graceful-shutdown-poc/tree/readiness): add readiness probe, and wait for readiness to fail before server close.

checkout these branches and run `skaffold run` to verify how they works.