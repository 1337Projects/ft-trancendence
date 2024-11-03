from django.shortcuts import render,redirect
from django.http import JsonResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from .models import User , PasswordReset
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from dotenv import load_dotenv, dotenv_values
from rest_framework.decorators import api_view
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.signals import user_logged_out
from urllib.parse import urlencode
from account.utls import create_profile
from datetime import timedelta
import requests, secrets , jwt, datetime, json, os, random, string, re

from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
 
load_dotenv()

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
    try:
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            raise AuthenticationFailed('Missing refresh token')
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        user = User.objects.get(pk=user_id)
        new_access_token = generate_access_token(user)
        response = JsonResponse({'access_token': new_access_token})
        return response
    except (jwt.exceptions.DecodeError, jwt.exceptions.ExpiredSignatureError, User.DoesNotExist, AuthenticationFailed):
        return JsonResponse({'error': 'Invalid refresh token'}, status=401)

def logout(request):
    response = JsonResponse({'message': 'Logout successful'}, status=200)
    response.delete_cookie('refresh_token')
    return response

@csrf_exempt
def intra_oauth(request):
    if request.method == 'GET' :
        return JsonResponse({"url": os.getenv("oauth_url")})
    elif request.method == 'POST' :
        code = json.loads(request.body).get("code")
        if not code:
            return JsonResponse({"error": "Authorization code not provided"}, status=400)
        data = {
            "code": code,
            "client_id": os.getenv("client_id_intra"),
            "client_secret": os.getenv("client_secret_intra"),
            "redirect_uri": os.getenv("redirect_uri_intra"),
            "grant_type": os.getenv("grant_type_intra"),
        }
        token_reponse = requests.post(os.getenv("token_url_intra"), data=data)
        token_data = token_reponse.json()
        if "error" in token_data:
            return JsonResponse({"error": "Failed to get access token"}, status=400)
        access_token = token_data['access_token']
        headers = {"Authorization": f"Bearer {access_token}"}
        userinfo_response = requests.get(os.getenv("userinfo_url_intra"), headers=headers)
        userinfo = userinfo_response.json()
        if "error" in userinfo:
            return JsonResponse({"error": "Failed to fetch user info"}, status=400)
        intra_id = userinfo['id']
        email = userinfo['email']
        first_name = userinfo['first_name']
        last_name = userinfo['last_name']
        name = generate_username(customize_username(userinfo['login']))
        image = userinfo['image']['link']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            user = User.objects.create_user(
                username=name,
                email=email,
                last_name=last_name,
                first_name=first_name,
                google_or_intra=True,
            )
            create_profile(user.id, image)
        try:
            access_token = generate_access_token(user)
            refresh_token = generate_refresh_token(user)
            response = JsonResponse({'access': access_token, "userinfo": userinfo, "status":200})
            set_refresh_token_cookie(response, refresh_token)

            return response
        except AuthenticationFailed:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)

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

@csrf_exempt
@api_view(["post"])
def google_oauth(request):
    code = request.data.get('code')
    if not code:#checki m3a abdelhadi
        return JsonResponse({'error': 'Authorization code is missing'}, status=400)

    token_url = 'https://oauth2.googleapis.com/token'
    data = {
        'code': code,
        'client_id': os.getenv("google_key"),
        'client_secret': os.getenv("google_secret"),
        'redirect_uri': os.getenv("redirect_uri_google"),
        'grant_type': os.getenv("grant_type"),
    }
    response = requests.post(token_url, data=data)
    if response.status_code != 200:
        return JsonResponse(response.json(), status=response.status_code)

    token_info = response.json()
    access_token = token_info.get('access_token')
    if access_token:
        user_info_url = 'https://www.googleapis.com/oauth2/v2/userinfo'
        user_info_response = requests.get(user_info_url, headers={'Authorization': f'Bearer {access_token}'})
        if user_info_response.status_code == 200:
            user_info = user_info_response.json()
            email = user_info.get('email')
            name = user_info.get('name')
            username = generate_username(customize_username(name))
            image = user_info.get('picture')
            if not email or not username:
                return JsonResponse({'error': 'Failed to retrieve user information'}, status=400)
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    last_name= ' '.join(name.split()[1:]) if name else "",
                    first_name= name.split()[0] if name else "",
                    google_or_intra=True,
                )
                create_profile(user.id, image)
            try:
                access_token = generate_access_token(user)
                refresh_token = generate_refresh_token(user)
                response = JsonResponse({'access': access_token,"status":200})
                set_refresh_token_cookie(response, refresh_token)
                return response
            except AuthenticationFailed:
                return JsonResponse({'error': 'Invalid credentials'}, status=401)

@api_view(["post"])
def forget_password(request):
    if request.method == 'POST':
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            if user.google_or_intra:
                return JsonResponse({'error': 'This account is registered with Google or Intra'}, status=400)
            token = default_token_generator.make_token(user)
            PasswordReset.objects.create(user=user, token=token)
            reset_link = f"http://localhost:5173/auth/forgetPassowrd?token={token}&email={email}"
            send_mail(
                'Request : Reset Password',
                f'A password change has been requested for your account. If this was you, please use the link below to reset your password: {reset_link}',
                'from@example.com',
                [email],
                fail_silently=False,
            )
            return JsonResponse({'message': 'the reset link has been send to your email'}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Email not found'}, status=404)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

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
    if errors:
        print("Your password should meet all those requirements:", errors)
        return False
    return True


@api_view(["post"])
def confirm_password(request):
    if request.method == 'POST':
        email = request.data.get('email')
        token = request.data.get('token')
        new_password = request.data.get('password')
        if not validate_password(new_password):
            return JsonResponse({'error': 'Password does not meet all the requirements.'}, status=400)
        try:
            password_reset = PasswordReset.objects.get(token=token, user__email=email)
            if password_reset.is_used:
                return JsonResponse({'error': 'Token has already been used.'}, status=400)
            user = password_reset.user
            if default_token_generator.check_token(user, token):
                user.set_password(new_password)
                user.save()
                password_reset.is_used = True
                password_reset.save()
                return JsonResponse({'message': 'Password has been reset'}, status=200)
            else:
                return JsonResponse({'error': 'Expired token'}, status=400)
        except PasswordReset.DoesNotExist:
            return JsonResponse({'error': 'Invalid token'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@api_view(["post"])
def change_password(request):
    old_password = request.data.get('old_password')
    if not old_password:
        return JsonResponse({'error': 'Old password is missing'}, status=400)
    if not check_password(old_password, request.user.password):
        return JsonResponse({'error': 'Invalid old password'}, status=400)
    new_password = request.data.get('new_password')
    if not new_password:
        return JsonResponse({'error': 'New password is missing'}, status=400)
    if not validate_password(new_password):
        return JsonResponse({'error': 'Password does not meet all the requirements.'}, status=400)

    request.user.password = make_password(new_password)
    request.user.save()
    return JsonResponse({'message': 'The Password has been changed'}, status=200)
