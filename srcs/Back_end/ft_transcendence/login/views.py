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
from dotenv import load_dotenv, dotenv_values
import os
from rest_framework.decorators import api_view
from ft_profile.models import user_logged_out
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.signals import user_logged_out

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
def google_oauth(request):
    if request.method == 'GET':
        params = {
            "client_id": os.getenv("client_id"),
            "redirect_uri": os.getenv("redirect_uri"),
            "response_type": os.getenv("response_type"),
            "scope": os.getenv("scope"),
            "state": os.getenv("state"),
            "access_type": os.getenv("access_type"),  # Optional: to get a refresh token
        }
        oauth_url = f"{os.getenv('googele_endpoint')}?{urllib.parse.urlencode(params)}"
        return JsonResponse({"url": oauth_url})
    elif request.method == 'POST' :
        #step1:
        code = json.loads(request.body).get("code")
        if not code:
            return JsonResponse({"error": "Authorization code not provided"}, status=400)
        #step2:
        data = {
            "code": code,
            "client_id": os.getenv("client_id"),
            "client_secret": os.getenv("client_secret"),
            "redirect_uri": os.getenv("redirect_uri") ,
            "grant_type": os.getenv("grant_type"),
        }
        token_response = requests.post(os.getenv("token_url"), data=data)
        token_data = token_response.json()
        if "error" in token_data:
            return JsonResponse({"error": "Failed to get access token"}, status=400)
        access_token = token_data['access_token']
        #step3:
        headers = {"Authorization": f"Bearer {access_token}"}
        userinfo_response = requests.get(os.getenv('userinfo_url'), headers=headers)
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
        name = userinfo.get('login')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            user = User.objects.create_user(
                username=name,
                email=email,
                last_name=name,
                first_name=name,
            )
        try:
            access_token = generate_access_token(user)
            refresh_token = generate_refresh_token(user)
            response = JsonResponse({'access': access_token})
            set_refresh_token_cookie(response, refresh_token)
            return response
        except AuthenticationFailed:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
      
@api_view(['POST'])
def login(request):
    data = json.loads(request.body)
    if len(data) != 2 or not data.get("username") or not data.get("password"):
        return Response({"message": "Bad informations", "data": data}, status=400)
    try:
        User.objects.get(username=data.get("username"), password=data.get("password"))
    except User.DoesNotExist:
        return Response({"message": "Bad informations", "data": data}, status=400)
    return Response({"message": "login successuful", "data": data}, status=200)

