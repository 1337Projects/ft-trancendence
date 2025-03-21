# Variables
DOCKER_COMPOSE = docker-compose
WORK_DIR = --project-directory ./srcs
DOCKER_COMPOSE_FILE = -f docker-compose.yml
DOCKER_COMPOSE_DEB = -f docker-compose.debug.yml
DOCKER_COMPOSE_PROD = -f docker-compose.prod.yml
MODE := $(shell cat .mode 2>/dev/null || echo prod)

ifeq ($(MODE), prod)
	DOCKER_COMPOSE += $(DOCKER_COMPOSE_FILE) $(DOCKER_COMPOSE_PROD)
else
	DOCKER_COMPOSE += $(DOCKER_COMPOSE_FILE) $(DOCKER_COMPOSE_DEB)
endif
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


all: build up

re: down build up

build:
	$(BUILD)

prod:
	@echo prod > .mode
	@echo "Switched to production mode (MODE=prod)."

dev:
	@echo dev > .mode
	@echo "Switched to development mode (MODE=dev)."

rebuild:
	$(REBUILD)
	$(UP)

up: 
	$(UP)

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
	docker-compose exec $(back_end_sevice) python manage.py makemigrations login account chat notifications tournment game background_task
	docker-compose exec $(back_end_sevice) python manage.py migrate

