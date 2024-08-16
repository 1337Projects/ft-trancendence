all:
	docker-compose up -d

down:
	docker-compose down
	docker system prune -a

clear:
	sudo rm -rf srcs/Back_end/virtualenv

stop:
	docker-compose stop

restart:
	docker-compose restart

re : down all