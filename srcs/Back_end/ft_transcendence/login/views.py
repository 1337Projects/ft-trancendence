from django.shortcuts import render,redirect
from django.http import JsonResponse
from django.conf import settings
import urllib.parse
from django.views.decorators.csrf import csrf_exempt
from .models import User
import requests
from rest_framework.response import Response
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
        'username':user.username,
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=15),
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return token

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
                username=email,
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

def intra_oauth(request):
    if request.method == 'GET':
        