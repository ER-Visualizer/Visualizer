#!/bin/bash
chmod +x transfer_env_vars.sh
echo "Transfering .env variables"
./transfer_env_vars.sh .env
export DEV_ENV=production
echo "Starting docker-compose"
docker-compose -f docker-compose-prod.yml up --build