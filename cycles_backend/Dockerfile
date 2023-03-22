FROM python:3.9-slim

WORKDIR /app

ENV PYTHONNUNBUFFERED 1

RUN apt-get update && apt-get install -y postgresql-client

RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install -r requirements.txt 

COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]