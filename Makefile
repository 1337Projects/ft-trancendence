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

clean:
	rm -rf srcs/Back_end/virtualenv
	rm -rf srcs/Back_end/ft_transcendence/ft_transcendence/__pycache__
	rm -rf srcs/Back_end/ft_transcendence/login/__pycache__
	rm -rf srcs/Back_end/ft_transcendence/login/migrations/*