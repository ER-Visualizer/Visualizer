# Instructions

## Docker Setup

Simply run 

```
docker-compose up
``` 

  and the client and server services will be instantiated with the ports indicated in the .env file. The client can be accessed at http://localhost:5000 at default.

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

## Testing

To ease testing, you can choose to only run one service at a time, i.e server or client.

This can be done simply by specifying:

```
docker-compose up client
```

or 

```
docker-compose up server
```

Note that there will be no connection to between services if run in this way.

Add the the option -d in order to run docker-compose on the background.

```
docker-compose up -d
```

To view logs after running ther services on the background:

```
 docker-compose logs -f
 ```
