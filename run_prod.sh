#!/bin/bash
export DEV_ENV=production
chmod +x transfer_env_vars.sh
echo "Transfering .env variables"
./transfer_env_vars.sh .env
echo "Starting docker-compose"
docker-compose -f docker-compose-prod.yml up --build