#!/bin/bash

WAIT_TIME=${1:-""}

HASH=$(cat /dev/random | head | md5sum | awk '{print $1}')

ENVS="RANDOM_HASH=${HASH}"

if [ "$WAIT_TIME" != "" ]; then
  ENVS="$ENVS WAIT_BEFORE_SERVER_CLOSE=${WAIT_TIME}"
fi

date
kubectl set env deployment/service-callee $ENVS
date