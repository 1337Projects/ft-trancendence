all:
	docker-compose up

down:
	docker-compose down
	docker system prune -a

stop:
	docker-compose stop

restart:
	docker-compose restart

re : down all