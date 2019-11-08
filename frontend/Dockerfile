# base image
FROM node:12.2.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g --silent

# start app
CMD ["npm", "start"]


# FROM node:8.9-alpine

# # Create a work directory and copy over our dependency manifest files.
# RUN mkdir /app
# WORKDIR /app
# COPY /src /app/src
# COPY ["package.json", "package-lock.json*", "./"]

# # If you're using yarn:
# #  yarn build
# RUN npm install --production --silent && mv node_modules ../

# # Expose PORT 3000 on our virtual machine so we can run our server
# EXPOSE 3000


# # base image
# FROM node:9.6.1

# # set working directory
# RUN mkdir /usr/src/app
# WORKDIR /usr/src/app

# # add `/usr/src/app/node_modules/.bin` to $PATH
# ENV PATH /usr/src/app/node_modules/.bin:$PATH

# # install and cache app dependencies
# COPY package.json /usr/src/app/package.json
# RUN npm install --silent
# RUN npm install react-scripts@1.1.1 -g --silent

# # start app
# CMD ["npm", "start"]