import datetime, jwt, string, random, os, re
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed
from django.http import JsonResponse
from .models import User
from urllib.parse import urlencode
from rest_framework_simplejwt.tokens import RefreshToken

def generate_refresh_token(user):
    payload = {
        'user_id': user.id,
        'username': user.username,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
    }
    refresh_token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return refresh_token

def set_refresh_token_cookie(response, refresh_token):
    response.set_cookie('refresh_token', refresh_token, httponly=True, secure=True, samesite='Lax')
    return response

def generate_access_token(user):
    payload = {
        'username': user.username,
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=15),
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return token

def refresh_token_view(request):
    """ hello world"""
    try:
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            raise AuthenticationFailed('Missing refresh token')
        
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']

        user = User.objects.get(pk=user_id)
        
        refresh = RefreshToken.for_user(user)
        refresh['username'] = user.username
        new_access_token = str(refresh.access_token)
        new_refresh_token = str(refresh)

        response = JsonResponse({'access_token': new_access_token})
        response.set_cookie('refresh_token', new_refresh_token, httponly=True, secure=True, samesite='Lax')
        return response
    except (jwt.exceptions.DecodeError, jwt.exceptions.ExpiredSignatureError, User.DoesNotExist, AuthenticationFailed):
        return JsonResponse({'error': 'Invalid refresh token'}, status=401)

def logout(request):
    response = JsonResponse({'message': 'Logout successful'}, status=200)
    response.delete_cookie('refresh_token')
    return response


def customize_username(name):
    name = name.split()
    length = len(name)
    if (length == 1):
        return name[0]
    elif length == 2:
        return f"{name[0][0]}{name[1][0:]}"
    elif length > 2:
        i = 2
        username = f"{name[0][0]}{name[1][0:]}-"
        while (i < length):
            username += name[i][0:]
            i += 1
        return username

def generate_random_string(length):
    letters = string.ascii_letters
    result_str = ''.join(random.choice(letters) for i in range(length))
    return result_str

def google_login(request):
    params = urlencode({
        'client_id': os.getenv("google_key"),
        'redirect_uri': os.getenv("redirect_uri_google"),
        'scope': os.getenv("scope"),
        'response_type': 'code',
    })
    google_auth_url = f'https://accounts.google.com/o/oauth2/auth?{params}'
    return JsonResponse({'url': google_auth_url})

def check_if_duplicate(username):
    users = User.objects.filter(username=username)
    return users.exists()

def generate_username(username):
    while (check_if_duplicate(username)):
        if (len(username) == 255):
            username = generate_random_string(15)
        else:
            username += str(random.randint(0, 9))   
            
    return username

def validate_password(password):    
    errors = []
    if len(password) < 8:
        errors.append("Password must be at least 8 characters long.")
    if not re.search(r'[A-Z]', password):
        errors.append("Password must contain at least one uppercase letter.")
    if not re.search(r'[a-z]', password):
        errors.append("Password must contain at least one lowercase letter.")
    if not re.search(r'\d', password):
        errors.append("Password must contain at least one digit.")
    if not re.search(r'\W', password):
        errors.append("Password must contain at least one special character.")
    return errors