#!/bin/bash
export DEV_ENV=production
chmod +x transfer_env_vars_frontend.sh
chmod +x transfer_env_vars_backend.sh
echo "Transfering .env variables"
./transfer_env_vars_frontend.sh .env
./transfer_env_vars_backend.sh .env
echo "Close any existing docker-compose"
docker-compose -f docker-compose-prod.yml down
echo "Starting docker-compose"
if [ "$1" = "build" ]
then
	docker-compose -f docker-compose-prod.yml up --build --force-recreate
else
	docker-compose -f docker-compose-prod.yml up
fi