# Instructions

## Docker setup
Simply run 

```
docker-compose up
```

and the client and server services will be instantiated with the ports indicated in the .env file.

The client can be accessed at http://localhost:5000 at default.

## Customizing ports

The defaults for ports are indicated as such:

The backend APIs are at port 8000 indicated by APP_SERVER_PORT in the .env file.
The client host port is 5000 indicated by REACT_APP_PORT in the .env file.

The values of the ports can be customized simply by changing the value in the .env file.

To switch from development to production change:

```
DEV_ENV=development
```

to 

```
DEV_ENV=production
```
