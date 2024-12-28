from account.serializer import UserWithFriendsSerializer
from .utls import *
from django.db.models import Q
from chat.views import get_id1
from datetime import timedelta
from django.conf import settings
from urllib.parse import urlencode
from account.models import Friends
from django.http import JsonResponse
# from django.shortcuts import redirect
from django.core.mail import send_mail
from account.utls import create_profile
from .models import User , PasswordReset
# from rest_framework.response import Response
from dotenv import load_dotenv, dotenv_values
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
# from django.contrib.auth import logout as auth_logout
# from django.contrib.auth.signals import user_logged_out
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.hashers import make_password, check_password
import requests, secrets , jwt, datetime, json, os, random, string, re

load_dotenv()

User = get_user_model()

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
            if user.twofa:
                request.session['user_id'] =  user.id
                request.session['retry_limit'] = 5
                request.session.set_expiry(300)
                response = JsonResponse({"2fa": "True", "status": 200})
            else:
                access_token = generate_access_token(user)
                response = JsonResponse({'access': access_token, "userinfo": userinfo, "2fa": "False", "status": 200})
                refresh_token = generate_refresh_token(user)
                set_refresh_token_cookie(response, refresh_token)
            return response
        except AuthenticationFailed:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)

@csrf_exempt
@api_view(["post"])
def google_oauth(request):
    code = request.data.get('code')
    if not code:
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
            image = "https://localhost:1024/media/avatar.jpg"
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
                if user.twofa:
                    request.session['user_id'] =  user.id
                    request.session['retry_limit'] = 5
                    request.session.set_expiry(300)
                    response = JsonResponse({"2fa": "True", "status": 200})
                else:
                    access_token = generate_access_token(user)
                    response = JsonResponse({'access': access_token, "userinfo": user_info, "2fa": "False", "status": 200})
                    refresh_token = generate_refresh_token(user)
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
            reset_link = f"https://localhost:1024/auth/forgetPassowrd?token={token}&email={email}"
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


@api_view(["post"])
def confirm_password(request):
    if request.method == 'POST':
        email = request.data.get('email')
        token = request.data.get('token')
        new_password = request.data.get('password')
        errors = validate_password(new_password)
        if errors:
            return JsonResponse({'error': errors}, status=400)
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
    id = get_id1(request)
    user = User.objects.get(id=id)
    if user.google_or_intra:
        return JsonResponse({'error': 'This account is registered with Google or Intra'}, status=400)
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    if not old_password or not new_password:
        return JsonResponse({'error': 'Old password or New password is missing'}, status=400)
    exist_password = User.objects.get(id=id).password
    if not check_password(old_password, exist_password):
        return JsonResponse({'error': 'Invalid old password'}, status=400)
    err = validate_password(new_password)
    if err:
        return JsonResponse({'error': err}, status=400)
    user.password = make_password(new_password)
    user.save()
    return JsonResponse({'message': 'The Password has been changed'}, status=200)



from tournment.utils import debug

@api_view(["post"])
def block_user(request):
    id = get_id1(request)
    try:
        target = request.data["data"]['id']
        if id == target:
            return JsonResponse({'message': 'You cannot block yourself'}, status=400)
        user1 = User.objects.get(id=id)
        try:
            friendship = Friends.objects.get(
                Q(sender=id, receiver=target) | Q(sender=target, receiver=id)
            )
            debug(friendship)

            if friendship.status == "blocked":
                return JsonResponse({'message': 'User is already blocked'}, status=400)
            if friendship.status != "accept":
                return JsonResponse({"message" : "you cant block this user"}, status=400)
            friendship.status = "blocked"
            friendship.blocker = user1
            friendship.save()
            serializer = UserWithFriendsSerializer(friendship)
            return JsonResponse({'message': 'User has been blocked', 'res' : serializer.data}, status=200)

        except Friends.DoesNotExist:
            return JsonResponse({'message': 'No friendship found'}, status=400)
    except User.DoesNotExist:
        debug("user doesnt found")
    except Exception as e:
        return JsonResponse({'message': 'data is missing'}, status=400)

    
        
@api_view(["post"])
def unblock_user(request):
    id = get_id1(request)
    try:
        # debug(request.data['data']['id'])
        target = request.data["data"]['id']
        if id == target:
            return JsonResponse({'message': 'You cannot unblock yourself'}, status=400)
        
        try:
            friendship = Friends.objects.get(
                Q(sender=id, receiver=target) | Q(sender=target, receiver=id))
            debug(friendship.blocker)
            if friendship.status == "blocked" and friendship.blocker.id == id:
                friendship.status='accept'
                friendship.blocker=None
                friendship.save()
                serializer = UserWithFriendsSerializer(friendship)
                return JsonResponse({'message': 'User has been unblocked', 'res' : serializer.data}, status=200)
            return JsonResponse({'message': 'you cant unblock this user'}, status=400)
        except Friends.DoesNotExist:
            return JsonResponse({'message': 'No friendship found'}, status=400)
    except Exception as e:
        return JsonResponse({'message': e}, status=400)

 
