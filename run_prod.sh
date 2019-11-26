#!/bin/bash
export DEV_ENV=production
chmod +x transfer_env_vars_frontend.sh
chmod +x transfer_env_vars_backend.sh
echo "Transfering .env variables"
./transfer_env_vars_frontend.sh .env
./transfer_env_vars_backend.sh .env
echo "Starting docker-compose"
docker-compose -f docker-compose-prod.yml up --build