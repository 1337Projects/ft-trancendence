from django.shortcuts import render,redirect
from django.http import JsonResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from .models import User
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from dotenv import load_dotenv, dotenv_values
from rest_framework.decorators import api_view
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.signals import user_logged_out
from urllib.parse import urlencode
import requests, secrets , jwt, datetime, json, os
 
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
            "redirect_uri": os.getenv("redirect_uri_inta"),
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
        name = userinfo['login']
        image = userinfo['image']['link']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            user = User.objects.create_user(
                username=name,
                email=email,
                last_name=last_name,
                first_name=first_name,
            )
            # create_profile(user.id, image)
        try:
            access_token = generate_access_token(user)
            refresh_token = generate_refresh_token(user)
            response = JsonResponse({'access': access_token, "userinfo": userinfo, "status":200})
            set_refresh_token_cookie(response, refresh_token)

            return response
        except AuthenticationFailed:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)


def google_login(request):
    params = urlencode({
        'client_id': '939461351021-ru3eqql8sgakc3unrce3s9n0bmlpln3g.apps.googleusercontent.com',
        # 'client_id': os.getenv("google_key"),
        'redirect_uri': os.getenv("redirect_uri"),
        'scope': os.getenv("scope"),
        'response_type': 'code',
    })
    google_auth_url = f'https://accounts.google.com/o/oauth2/auth?{params}'
    return JsonResponse({'url': google_auth_url})

@csrf_exempt
@api_view(["post"])
def google_oauth(request):
    code = request.data.get('code')
    if not code:
        return Response({'error': 'Authorization code is missing'}, status=400)

    token_url = 'https://oauth2.googleapis.com/token'
    data = {
        'code': code,
        'client_id': '939461351021-ru3eqql8sgakc3unrce3s9n0bmlpln3g.apps.googleusercontent.com',
        'client_secret': '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',
        'redirect_uri': 'http://localhost:5173/auth/oauth/google',
        'grant_type': 'authorization_code',
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
            username = user_info.get('name')
            if not email or not username:
                return JsonResponse({'error': 'Failed to retrieve user information'}, status=400)
            user, created = User.objects.update_or_create(
                email=email,
                defaults={
                    'username': username,
                    'email': email,
                    'last_name': username,
                    'first_name': username,
                }
            )
            try:
                access_token = generate_access_token(user)
                refresh_token = generate_refresh_token(user)
                response = JsonResponse({'access': access_token,"status":200})
                set_refresh_token_cookie(response, refresh_token)
                return response
            except AuthenticationFailed:
                return JsonResponse({'error': 'Invalid credentials'}, status=401)
            return Response({'status': 200, 'access': jwt_token}, status=200)
    else:
        return JsonResponse({'error': 'Failed to retrieve access token'}, status=400)
