from django.urls import reverse
from rest_framework.test import APIClient
from login.models import User

def create_user_and_login(username, email, password, first_name, last_name):
    """Create a new user and return user and access_token."""
    client = APIClient()
    url = reverse('register')
    response = client.post(url, {
        'email': email,
        'username': username,
        'first_name': first_name,
        'last_name': last_name,
        'password': password
    }, format='json')
    assert response.status_code == 201
    user = User.objects.get(username=username)
    assert user.username == username
    response = client.post('/api/users/api/login/', {
        'email': email,
        'password': password
    }, format='json')
    
    assert response.status_code == 200
    access_token = response.data['access']
    return user, access_token