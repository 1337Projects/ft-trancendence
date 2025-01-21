from rest_framework.test import APIClient
from login.models import User

def create_user_and_login(username, email, password, first_name, last_name):
    """Create a new user and return user and access_token."""
    user = User.objects.create_user(
        email=email,
        username=username,
        first_name=first_name,
        last_name=last_name,
        password=password,
    )
    
    assert user.email == email 
    assert user.username == username 
    assert user.first_name == first_name 
    assert user.last_name == last_name 
    assert user.check_password(password)
    
    client = APIClient()
    response = client.post('/api/users/api/login/', {
        'email': email,
        'password': password
    }, format='json')
    
    assert response.status_code == 200
    access_token = response.data['access']
    return user, access_token