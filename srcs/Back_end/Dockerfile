FROM ubuntu

RUN  apt-get update -y

RUN apt-get update && apt-get install -y python3-pip python3-xyz

RUN apt install python3.12-venv -y

RUN apt-get install -y python3-pip

RUN mkdir ft_transcendence

WORKDIR /ft_transcendence/

COPY ft_transcendence .

RUN python3 -m venv env

RUN /bin/bash -c "source /ft_transcendence/env/bin/activate"

RUN apt-get update && apt-get install -y libpq-dev

RUN pip install -r requirements.txt

EXPOSE 8000

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]

