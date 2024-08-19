from django.shortcuts import render,redirect
from django.http import JsonResponse
from django.conf import settings
import urllib.parse
from django.views.decorators.csrf import csrf_exempt
from .models import User
import requests
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
import jwt
import json
import datetime

def generate_refresh_token(user):
    payload = {
        'user_id': user.id,
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
def google_oauth(request):
    if request.method == 'GET':
        # Define the Google OAuth 2.0 endpoint
        google_oauth_endpoint = "https://accounts.google.com/o/oauth2/auth"

        # Client ID and Redirect URI from Google Developer Console
        client_id = "1063752047067-68ak54eimd9bkcorgsvmp918vk85e57c.apps.googleusercontent.com"
        redirect_uri = "http://localhost:5173/auth/oauth"  # This is where Google will redirect after authentication
        response_type = "code"  # We're using the authorization code flow
        scope = "openid email profile"  # Define the scopes you want
        state = "random_state_string"  # Optional: helps protect against CSRF attacks

        # Construct the full URL for the authorization request
        params = {
            "client_id": client_id,
            "redirect_uri": redirect_uri,
            "response_type": response_type,
            "scope": scope,
            "state": state,
            "access_type": "offline",  # Optional: to get a refresh token
        }
        
        # Build the query string
        oauth_url = f"{google_oauth_endpoint}?{urllib.parse.urlencode(params)}"

        # Return the URL to the frontend
        return JsonResponse({"url": oauth_url})
    elif request.method == 'POST' :
        #step1:
        code = json.loads(request.body).get("code")
        if not code:
            return JsonResponse({"error": "Authorization code not provided"}, status=400)
        #step2:
        token_url = "https://oauth2.googleapis.com/token"
        data = {
            "code": code,
            "client_id": "1063752047067-68ak54eimd9bkcorgsvmp918vk85e57c.apps.googleusercontent.com",
            "client_secret": "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",
            "redirect_uri": "http://localhost:5173/auth/oauth",
            "grant_type": "authorization_code",
        }
        token_response = requests.post(token_url, data=data)
        token_data = token_response.json()
        if "error" in token_data:
            return JsonResponse({"error": "Failed to get access token"}, status=400)
        access_token = token_data['access_token']
        #step3:
        userinfo_url = "https://www.googleapis.com/oauth2/v1/userinfo"
        headers = {"Authorization": f"Bearer {access_token}"}
        userinfo_response = requests.get(userinfo_url, headers=headers)
        userinfo = userinfo_response.json()
        if "error" in userinfo:
            return JsonResponse({"error": "Failed to fetch user info"}, status=400)
        google_id = userinfo['id']
        email = userinfo['email']
        name = userinfo.get('name')
        #step4:
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            user = User.objects.create_user(
                username=name.split()[1] if name else "",
                email=email,
                last_name=name.split()[0] if name else "",
                first_name=name.split()[1] if name else "",
                google_id=google_id,
            )
        #step5:
        try:
            access_token = generate_access_token(user)
            refresh_token = generate_refresh_token(user)
            response = JsonResponse({'access': access_token})
            set_refresh_token_cookie(response, refresh_token)
            return response
        except AuthenticationFailed:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)

@csrf_exempt
def intra_oauth(request):
    if request.method == 'GET' :
        oauth_url = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-6d2959210e86a5215856b8429ac7fb1d14b7bf99663a51cdff0bc4b949bd04bf&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fauth%2Foauth%2F42&response_type=code'
        return JsonResponse({"url": oauth_url})
    elif request.method == 'POST' :
        code = json.loads(request.body).get("code")
        if not code:
            return JsonResponse({"error": "Authorization code not provided"}, status=400)
        token_url = "https://api.intra.42.fr/oauth/token"
        data = {
            "code": code,
            "client_id": "u-s4t2ud-6d2959210e86a5215856b8429ac7fb1d14b7bf99663a51cdff0bc4b949bd04bf",
            "client_secret": "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",
            "redirect_uri": "http://localhost:5173/auth/oauth/42",
            "grant_type": "authorization_code",
        }
        token_reponse = requests.post(token_url, data=data)
        token_data = token_reponse.json()
        if "error" in token_data:
            return JsonResponse({"error": "Failed to get access token"}, status=400)
        access_token = token_data['access_token']
        userinfo_url = "https://api.intra.42.fr/v2/me"
        headers = {"Authorization": f"Bearer {access_token}"}
        userinfo_response = requests.get(userinfo_url, headers=headers)
        userinfo = userinfo_response.json()
        if "error" in userinfo:
            return JsonResponse({"error": "Failed to fetch user info"}, status=400)
        intra_id = userinfo['id']
        email = userinfo['email']
        name = userinfo.get('login')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            user = User.objects.create_user(
                username=name,
                email=email,
                last_name=name,
                first_name=name,
                google_id=intra_id,
            )
        try:
            access_token = generate_access_token(user)
            refresh_token = generate_refresh_token(user)
            response = JsonResponse({'access': access_token})
            set_refresh_token_cookie(response, refresh_token)
            return response
        except AuthenticationFailed:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
         