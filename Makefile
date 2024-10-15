# Variables
DOCKER_COMPOSE = docker-compose
WORK_DIR = --project-directory ./srcs
DOCKER_COMPOSE_FILE = -f docker-compose.yml
DOCKER_COMPOSE_DEB = -f docker-compose.debug.yml
# ifdef dev
	DOCKER_COMPOSE += $(DOCKER_COMPOSE_FILE) $(DOCKER_COMPOSE_DEB)
# endif
DOCKER_COMPOSE_OVERRIDE = -f srcs/docker-compose.override.yml
BUILD = $(DOCKER_COMPOSE)  build
REBUILD = $(DOCKER_COMPOSE)  build --no-cache
UP = $(DOCKER_COMPOSE)  up
DOWN = $(DOCKER_COMPOSE)  down
LOGS = $(DOCKER_COMPOSE)  logs
RESTART = $(DOCKER_COMPOSE)  restart
CONFIG = $(DOCKER_COMPOSE)  config
PS = $(DOCKER_COMPOSE)  ps

# Targets
.PHONY: all build up down logs restart config ps clean

all: build up

re: down build up

build:
	$(BUILD)

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

fclean:
	$(DOWN)
	docker system prune --all


back_end_sevice=be
bash:
	docker-compose exec $(back_end_sevice) bash
migrate:
	docker-compose exec $(back_end_sevice) python manage.py makemigrations
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
# 	rm -rf srcs/Back_end/ft_transcendence/media/*
# 	rm -rf srcs/Back_end/ft_transcendence/chat/migrations/*
# 	rm -rf srcs/Back_end/ft_transcendence/chat/__pycache__
# 	rm -rf .DS_Store
# 	rm -rf srcs/.DS_Store
# match: down clear
	
