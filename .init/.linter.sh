#!/bin/bash
cd /home/kavia/workspace/code-generation/tic-tac-toe-web-bbcd1e48/frontend_web_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

