import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from login.models import User
from game.models import Game
from game.tests.test_utils import create_user_and_login
from icecream import ic

@pytest.mark.django_db
class TestUserGameStatsView:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.client = APIClient()
        self.user1, self.token1 = create_user_and_login(
            username='testuser1',
            email='user1@example.com',
            password='Password.test1',
            first_name='Test1',
            last_name='User1'
        )
        self.user2, self.token2 = create_user_and_login(
            username='testuser2',
            email='user2@example.com',
            password='Password.test1',
            first_name='Test2',
            last_name='User2'
        )
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token1)
        Game.objects.create(player1=self.user1, player2=self.user2, winner=self.user1)
        Game.objects.create(player1=self.user1, player2=self.user2, winner=self.user2)
        Game.objects.create(player1=self.user1, player2=self.user2, winner=self.user2)
        Game.objects.create(player1=self.user2, player2=self.user1, winner=self.user2)
        Game.objects.create(player1=self.user2, player2=self.user1, winner=self.user1)

    def test_user1_game_stats(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token1)
        url = reverse('user_game_stats', kwargs={'username': self.user1.username})
        response = self.client.get(url)
        
        assert response.status_code == 200
        assert response.data['games_played'] == 5
        assert response.data['games_won'] == 2
        assert response.data['games_lost'] == 3

    def test_user2_game_stats(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token2)
        url = reverse('user_game_stats', kwargs={'username': self.user2.username})
        response = self.client.get(url)
        
        assert response.status_code == 200
        assert response.data['games_played'] == 5
        assert response.data['games_won'] == 3
        assert response.data['games_lost'] == 2
        
    def test_game_stats_for_non_exist_user(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token1)
        url = reverse('user_game_stats', kwargs={'username': 'test'})
        response = self.client.get(url)
        assert response.status_code == 404
        assert response.data == {'error': 'User not found'}
        

    def test_user1_game_history(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token1)
        url = reverse('user_game_history', kwargs={'username': self.user1.username})
        response = self.client.get(url)
        
        assert response.status_code == 200
        assert len(response.data) == 5
        assert response.data[0]['winner'] == self.user1.id
        assert response.data[1]['winner'] == self.user2.id
        assert response.data[2]['winner'] == self.user2.id
        assert response.data[3]['winner'] == self.user2.id
        assert response.data[4]['winner'] == self.user1.id

    def test_user2_game_history(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token2)
        url = reverse('user_game_history', kwargs={'username': self.user2.username})
        response = self.client.get(url)
        
        assert response.status_code == 200
        assert len(response.data) == 5
        assert response.data[0]['winner'] == self.user1.id
        assert response.data[1]['winner'] == self.user2.id
        assert response.data[2]['winner'] == self.user2.id
        assert response.data[3]['winner'] == self.user2.id
        assert response.data[4]['winner'] == self.user1.id
    
    def test_game_history_for_non_exist_user(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token1)
        url = reverse('user_game_history', kwargs={'username': 'test'})
        response = self.client.get(url)
        ic(response, response.data)
        assert response.status_code == 404
        assert response.data == {'error': 'User not found'} 