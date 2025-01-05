# Variables
DOCKER_COMPOSE = docker-compose
WORK_DIR = --project-directory ./srcs
DOCKER_COMPOSE_FILE = -f docker-compose.yml
DOCKER_COMPOSE_DEB = -f docker-compose.debug.yml
DOCKER_COMPOSE += $(DOCKER_COMPOSE_FILE) $(DOCKER_COMPOSE_DEB)
DOCKER_COMPOSE_OVERRIDE = -f srcs/docker-compose.override.yml
BUILD = $(DOCKER_COMPOSE)  build
REBUILD = $(DOCKER_COMPOSE)  build --no-cache
UP = $(DOCKER_COMPOSE)  up
DOWN = $(DOCKER_COMPOSE)  down
LOGS = $(DOCKER_COMPOSE)  logs -f
RESTART = $(DOCKER_COMPOSE)  restart
CONFIG = $(DOCKER_COMPOSE)  config
PS = $(DOCKER_COMPOSE)  ps

# Targets
.PHONY: all build up down logs restart config ps clean

HOSTNAME := $(shell hostname -f)

all: build up

re: down build up

build:
	$(BUILD)

rebuild:
	$(REBUILD)
	$(UP)

up: 
	HOSTNAME=${HOSTNAME} $(UP)

down:
	$(DOWN)

logs:
	$(LOGS)

restart:
	$(RESTART)

config:
	$(CONFIG)

ps:
	$(PS)

clean:
	$(DOWN)
	docker system prune -f

vclean:
	$(DOWN) --volumes
	docker system prune -f

fclean:
	$(DOWN) --volumes
	docker system prune --all -f

back_end_sevice=be
test:
	docker-compose exec $(back_end_sevice) pytest game/tests.py

bash:
	docker-compose exec $(back_end_sevice) bash

freeze:
	docker-compose exec $(back_end_sevice) pip freeze > srcs/Back_end/requirements.txt

migrate:
	docker-compose exec $(back_end_sevice) python manage.py makemigrations login account chat notifications game background_task
	docker-compose exec $(back_end_sevice) python manage.py migrate

# all:
# 	docker-compose up -d

# down:
# 	docker-compose down
# 	docker system prune -a

# clear: clean
# 	rm -rf srcs/Back_end/virtualenv

# stop:
# 	docker-compose stop

# restart:
# 	docker-compose restart

# re : down all

# clean:
# 	rm -rf srcs/Back_end/ft_transcendence/ft_transcendence/__pycache__
# 	rm -rf srcs/Back_end/ft_transcendence/login/__pycache__
# 	rm -rf srcs/Back_end/ft_transcendence/login/migrations/*
# 	rm -rf srcs/Back_end/ft_transcendence/account/migrations/*
# 	rm -rf srcs/Back_end/ft_transcendence/account/__pycache__
# 	rm -rf srcs/Back_end/ft_transcendence/tournment/migrations/*
# 	rm -rf srcs/Back_end/ft_transcendence/tournment/__pycache__
# 	rm -rf srcs/Back_end/ft_transcendence/notifications/migrations/*
# 	rm -rf srcs/Back_end/ft_transcendence/notifications/__pycache__
# 	rm -rf srcs/Back_end/ft_transcendence/chat/migrations/*
# 	rm -rf srcs/Back_end/ft_transcendence/chat/__pycache__
# 	rm -rf srcs/Back_end/ft_transcendence/game/__pycache__
# 	rm -rf srcs/Back_end/ft_transcendence/game/migrations/*
# 	rm -rf srcs/Back_end/ft_transcendence/game/backend/__pycache__
# 	rm -rf .DS_Store
# 	rm -rf srcs/.DS_Store
# match: down clear

