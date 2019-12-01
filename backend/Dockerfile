FROM simran224/vectorinstituteteam:latest

COPY ./app /app
COPY ./.env /app/.env
WORKDIR /app
COPY requirements.txt ./
RUN pip3 install --upgrade pip
RUN pip install --upgrade -r requirements.txt
RUN rm -f requirements.txt

ENV FLASK_APP=./main.py
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8
CMD flask run --host 0.0.0.0 --port 80

COPY . ./

