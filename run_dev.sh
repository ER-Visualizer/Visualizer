#!/bin/bash
chmod +x transfer_env_vars.sh
echo "Transfering .env variables"
./transfer_env_vars.sh .env
echo "Starting docker-compose"
docker-compose -f docker-compose.yml up --build --force-recreate