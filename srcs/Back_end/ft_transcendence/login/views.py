from account.serializer import UserWithFriendsSerializer
from .utls import *
from django.db.models import Q
# from datetime import timedelta
from django.conf import settings
# from urllib.parse import urlencode
from account.models import Friends
from django.http import JsonResponse
# from django.shortcuts import redirect
from django.core.mail import send_mail
from account.utls import create_profile
from .models import User , PasswordReset
# from rest_framework.response import Response
from dotenv import load_dotenv, dotenv_values
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.hashers import make_password, check_password
import requests, secrets , jwt, datetime, json, os, random, string, re

load_dotenv()

User = get_user_model()

@csrf_exempt
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
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
                refresh = RefreshToken.for_user(user)
                refresh['username'] = user.username
                access_token = str(refresh.access_token)
                response = JsonResponse({'access': access_token, "userinfo": userinfo, "2fa": "False", "status": 200})
                refresh_token = str(refresh)
                set_refresh_token_cookie(response, refresh_token)
            return response
        except AuthenticationFailed:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def google_oauth(request):
    code = request.data.get('code')
    if not code:
        return JsonResponse({'error': 'Authorization code is missing'}, status=400)
    data = {
        'code': code,
        'client_id': os.getenv("google_key"),
        'client_secret': os.getenv("google_secret"),
        'redirect_uri': os.getenv("redirect_uri_google"),
        'grant_type': os.getenv("grant_type"),
    }
    response = requests.post(os.getenv("token_url_google"), data=data)
    if response.status_code != 200:
        return JsonResponse(response.json(), status=response.status_code)
    token_info = response.json()
    access_token = token_info.get('access_token')
    if access_token:
        user_info_response = requests.get(os.getenv("userinfo_url_google"), headers={'Authorization': f'Bearer {access_token}'})
        if user_info_response.status_code == 200:
            user_info = user_info_response.json()
            if "error" in user_info:
                return JsonResponse({"error": "Failed to fetch user info"}, status=400)
            email = user_info.get('email')
            name = user_info.get('name')
            username = generate_username(customize_username(name))
            image = f"{os.environ.get('API_URL')}media/default-avatar.jpeg"
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
                    refresh = RefreshToken.for_user(user)
                    refresh['username'] = user.username
                    access_token = str(refresh.access_token)
                    response = JsonResponse({'access': access_token, "2fa": "False", "status": 200})
                    refresh_token = str(refresh)
                    set_refresh_token_cookie(response, refresh_token)
                    return response
            except AuthenticationFailed:
                return JsonResponse({'error': 'Invalid credentials'}, status=401)

@api_view(["POST"])
@permission_classes([AllowAny])
def forget_password(request):
    if request.method == 'POST':
        try:
            email = request.data.get('email')
            user = User.objects.get(email=email)
            if user.google_or_intra:
                return JsonResponse({'error': 'This account is registered with Google or Intra'}, status=400)
            token = default_token_generator.make_token(user)
            PasswordReset.objects.create(user=user, token=token)
            reset_link = f"{os.environ.get('API_URL')}auth/forgetPassowrd?token={token}&email={email}"
            send_mail(
                'Request : Reset Password',
                f'A password change has been requested for your account. If this was you, please use the link below to reset your password: {reset_link}',
                'from@example.com',
                [email],
                fail_silently=False,
            )
            return JsonResponse({'message': 'the reset link has been send to your email'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=405)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def confirm_password(request):
    try:
        if request.method == 'POST':
            email = request.data.get('email')
            token = request.data.get('token')
            new_password = request.data.get('password')
            errors = validate_password(new_password)
            if errors:
                return JsonResponse({'error': errors}, status=400)
            try:
                password_reset = PasswordReset.objects.get(token=token, user__email=email)
            except PasswordReset.DoesNotExist:
                return JsonResponse({'error': 'Invalid token'}, status=400)
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
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    try:
        id = request.user.id
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
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



from tournment.utils.utils import debug

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def block_user(request):
    id = request.user.id
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

    
        
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def unblock_user(request):
    id = request.user.id
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

 
