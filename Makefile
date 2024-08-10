all:
	docker-compose up

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