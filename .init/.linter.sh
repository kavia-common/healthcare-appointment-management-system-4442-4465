#!/bin/bash
cd /home/kavia/workspace/code-generation/healthcare-appointment-management-system-4442-4465/frontend_client
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

