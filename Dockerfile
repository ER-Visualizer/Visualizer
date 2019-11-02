# FROM tiangolo/uwsgi-nginx-flask:python3.7
FROM terrillo/python3flask:latest

# FROM python:3.7.2-alpine3.9
# RUN apk add --no-cache python3-dev libstdc++ && \
#     apk add --no-cache g++ && \
#     ln -s /usr/include/locale.h /usr/include/xlocale.h && \
#     pip3 install numpy && \
    # pip3 install pandas

COPY ./app /app

WORKDIR /app
COPY requirements.txt ./
RUN pip3 install --upgrade pip
RUN pip install --upgrade -r requirements.txt
RUN rm -f requirements.txt


ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8
ENV FLASK_APP=./main.py


CMD flask run --host 0.0.0.0 --port 80
COPY . ./