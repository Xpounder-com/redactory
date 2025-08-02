#!/usr/bin/env bash
set -e

if [ "$ONNXRUNTIME_GPU" = "1" ]; then
  export npm_config_onnxruntime_build=gpu
else
  export npm_config_onnxruntime_build=cpu
fi

npm install onnxruntime-node
