#!/usr/bin/env bash
set -e

if [ "$ONNXRUNTIME_GPU" = "1" ]; then
  export npm_config_onnxruntime_build=gpu
else
  export npm_config_onnxruntime_build=cpu
fi

# Install without modifying package.json so the CPU build is used by default.
npm install onnxruntime-node --no-save
