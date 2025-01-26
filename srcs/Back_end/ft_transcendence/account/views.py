from django.shortcuts import render, get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import (
        Profile, 
        Friends, 
        ExperienceLog,
)
from login.models import User
from game.models import Game1
from login.views import check_if_duplicate 
from .serializer import ProfileSerializers, UserWithProfileSerializer, UserWithFriendsSerializer, ExperienceLogSerializer
from game.serializers import TicTacTeoSerializer
import json, jwt, sys
from rest_framework.exceptions import PermissionDenied, AuthenticationFailed
from django.conf import settings
from login.views import generate_access_token, generate_refresh_token, set_refresh_token_cookie
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from .utls import *
from datetime import timedelta
from .tasks import delete_qr_code_image
from rest_framework_simplejwt.tokens import RefreshToken

import qrcode
import pyotp, os, io
from django.core.files.base import ContentFile    
from django_otp.plugins.otp_totp.models import TOTPDevice

from rest_framework.permissions import IsAuthenticated, AllowAny


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile_infos(request):
    if not Profile.objects.filter(user_id=request.user.id).exists():
        return Response({"message": "this user is not exist", "id": id}, status=400)
    user = get_infos(request.user.id)
    return Response({"data": user.data}, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    username = request.GET.get('query')
    users = User.objects.filter(username__startswith=username).exclude(id=request.user.id)
    serializer = UserWithProfileSerializer(users, many=True)
    return Response({"data": serializer.data}, status=200)


@api_view(['GET'])  
@permission_classes([IsAuthenticated])
def get_profile(request, username):
    if not User.objects.filter(username=username).exists():
        return Response({"message": "this user is not exist"}, status=400)
    user = get_object_or_404(User, username=username)
    serialiser = UserWithProfileSerializer(user)
    return Response({"data": serialiser.data}, status=200)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def set_infos(request):
    try:
        user_infos = request.data.get('user')
        user_infos_dict = json.loads(user_infos)
        user_id = request.user.id
        first_name = user_infos_dict.get('first_name')
        last_name = user_infos_dict.get('last_name')
        bio = user_infos_dict.get('profile')['bio']
        User.objects.filter(id=user_id).update(
            first_name=first_name,
            last_name=last_name,
        )
        if bio is not None:
            Profile.objects.filter(id=user_id).update(bio=bio)   
        if 'avatar' in request.FILES:
            if request.FILES['avatar'].size > (3 * 1024 * 1024):
                return Response({"message": "File size should not exceed 3 MB.","res": get_infos(user_id).data}, status=400)
            format_check = check_format(request.FILES['avatar'])
            if format_check != 'valid format':
                return Response({"message": format_check, "res": get_infos(user_id).data}, status=400) 
            name = manage_images(user_id, request, 'avatar')
            Profile.objects.filter(user_id=user_id).update(
                avatar=f'{os.environ.get("API_URL")}media/{name}'
            )
        if 'banner' in request.FILES:
            if request.FILES['banner'].size > (3 * 1024 * 1024):    
                return Response({"message": "File size should not exceed 3 MB.","res": get_infos(user_id).data}, status=400)
            format_check = check_format(request.FILES['banner'])
            if format_check != 'valid format':
                return Response({"message": format_check, "res": get_infos(user_id).data}, status=400) 
            name = manage_images(user_id, request, 'banner')
            Profile.objects.filter(user_id=user_id).update(
                banner=f'{os.environ.get("API_URL")}media/{name}'
            )
        return Response({"status": 200, "res": get_infos(user_id).data}, status=200)
    except Exception as e:
        return Response({"status": 400, "error": str(e)}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def friends_infos(request):
    try:
        user = get_object_or_404(User, id=request.user.id)
        friends = Friends.objects.filter(Q(sender=user) | Q(receiver=user))
        serializer = UserWithFriendsSerializer(friends, many=True)
        return Response({"data" : serializer.data})
    except Exception as e:
        return Response({"error": str(e)}, status=401)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_friend(request):
    try:
        sender = User.objects.get(id=request.user.id)
        if 'data' in request.data:
            data = request.data.get('data')
            receiver_id = data.get('id')
            receiver = User.objects.get(id=receiver_id)
            if Friends.objects.filter(Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender)):
                return Response({"message": "there is a relation between him"}, status=400)
            else:
                new_relation = Friends.objects.create(status="waiting", sender=sender, receiver=receiver)
                new_relation.save()
                serializer = UserWithFriendsSerializer(new_relation)
                return Response({"res": serializer.data}, status=200)
        else:
            return Response({"message": "there is no data recieved"}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_friend(request):
    try:
        receiver = User.objects.get(id=request.user.id)
        if 'data' in request.data:
            data = request.data.get('data')
            sender_id = data.get('id')
            sender = User.objects.get(id=sender_id)
            relationship = Friends.objects.filter(sender=receiver, receiver=sender)
            if relationship:
                return Response({"message": "can't serve this request"}, status=400)
            try:
                relation_friend = Friends.objects.get(sender=sender, receiver=receiver)
                relation_friend.status = "accept"
                relation_friend.save()
                serializer = UserWithFriendsSerializer(relation_friend)
                return Response({"res": serializer.data}, status=200)
            except ObjectDoesNotExist:
                return Response({"message": "the Friends object does not exist"}, status=400)
        return Response({"message": "there is no data recieved"}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_friend(request):
    try:
        receiver = User.objects.get(id=request.user.id)
        if 'data' in request.data:
            data = request.data.get('data')
            sender_id = data.get('id')
            sender = User.objects.get(id=sender_id)
            relationship = Friends.objects.filter(sender=receiver, receiver=sender)
            if relationship:
                return Response({"message": "can't serve this request"}, status=400)
            try:
                relation_friend = Friends.objects.get(sender=sender, receiver=receiver)
                query_id = relation_friend.id
                relation_friend.delete()
                return Response({"message": "reject successful", "id": query_id}, status=200)
            except ObjectDoesNotExist:
                return Response({"message": "the Friends object does not exist"}, status=400)
        return Response({"message": "there is no data recieved"}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unfriend(request):
    try:
        sender = User.objects.get(id=request.user.id)
        if 'data' in request.data:
            data = request.data.get('data')
            receiver_id = data.get('id')
            receiver = User.objects.get(id=receiver_id)
            try :
                relationship = Friends.objects.get(Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender))
                query_id = relationship.id 
                relationship.delete()
                return Response({"message": "unfriend successul", "id": query_id}, status=200)
            except ObjectDoesNotExist:
                return Response({"message": "the Friends object does not exist"}, status=400)
        return Response({"message": "there is no data recieved"}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_friends(request):
    try:
        user = User.objects.get(id=request.user.id)
        friends = Friends.objects.filter(Q(sender=user) | Q(receiver=user), status='accept')
        serializer = UserWithFriendsSerializer(friends, many=True)
        return Response({"data" : serializer.data})
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_2fa(request):
    try:
        user = User.objects.get(id=request.user.id)
        if 'data' in request.data:
            data = request.data.get('data')
            if 'topt' in data:
                code = data.get('topt')
                if validate_totp(user=user, otp=code):
                    user.twofa = True
                    user.save()
                    return Response({"status": 200, "message": "Successful"}, status=200)
                else:
                    return Response({"status": 401, "message": "Invalid TOPT"}, status=401)
            else:
                return Response({"status": 400, "message": "Invalild data"}, status=400)
        else:
            return Response({"status": 400, "message": "Invalild data"}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=401)

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_2fa_qr_code(request):
    try:
        user = User.objects.get(id=request.user.id)
        totp = pyotp.TOTP(pyotp.random_base32())
        user.secret_key = totp.secret
        user.save()
        uri = totp.provisioning_uri(name=user.email, issuer_name="FT_TRANCANDENCE")
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(uri)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")

        img_io = io.BytesIO()
        img.save(img_io, format='PNG')
        img_io.seek(0)

        file_name = f"{uuid.uuid4()}-qr_code_image.png"
        default_storage.save(file_name, ContentFile(img_io.read()))

        delete_qr_code_image(file_name, schedule=20)

        return Response({"qr_code_image": f"{os.environ.get('API_URL')}media/" + file_name}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=401)


@api_view(['POST'])
@csrf_exempt
@permission_classes([AllowAny])
def check_topt(request):
    try:
        user_id = request.session.get('user_id')
        user_retry = request.session.get('retry_limit')
        if not user_id:
            return JsonResponse({'error': 'Invalid data from the session'}, status=400)
        
        if user_retry <= 0:
            return JsonResponse({'error': 'Retry limit exceeded. Please try again later.'}, status=429)

        if 'data' in request.data:
            data = request.data.get('data')
            if 'topt' in data:
                opt = data.get('topt')
                user = User.objects.get(id=user_id)
                if validate_totp(user=user, otp=opt):
                    refresh = RefreshToken.for_user(user)
                    refresh['username'] = user.username
                    access_token = str(refresh.access_token)
                    response = JsonResponse({"access": access_token, "message": "Successful", "status":200}, status=200)
                    set_refresh_token_cookie(response, refresh)
                    return response
                else:
                    request.session['retry_limit'] -= 1
                    return JsonResponse({"status": 400, "message": "Invalid TOPT",}, status=400)
            else:
                return JsonResponse({"status": 400, "message": "Invalid data"}, status=400)
        else:
            return JsonResponse({"status": 400, "message": "Invalid data"}, status=400)
    except Exception as e:
        return JsonResponse({"status": 400, "errr": str(e)}, status=400)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def is_2fa_enable(request):
    try:
        user = get_object_or_404(User, id=request.user.id)
        if user.twofa:
            return Response({"twofa" : "True"}, status=200)
        else:
            return Response({"twofa" : "False"}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=401)
    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def disable_2fa(request):
    try:
        user = get_object_or_404(User, id=request.user.id)
        user.twofa = False
        user.secret_key = 'DEFAULT_SECRET'
        user.save()
        return JsonResponse({'status': '200', 'message': 'Secret key deleted successfully'}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=401)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_others_friends(request, username):
    try :
        id = request.user.id
        user = User.objects.get(username=username)
        current_user = User.objects.get(id=id)
        friends_filter  = Friends.objects.filter(Q(sender=user) | Q(receiver=user), status='accept').exclude(
            Q(sender=current_user, receiver=user)  | Q(sender=user, receiver=current_user)
        )
        serializer = UserWithFriendsSerializer(friends_filter , many=True)
        return Response({"data" : serializer.data})
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_lst_not_time(request):
    try:
        id = request.user.id
        time = request.data.get("time")
        user = User.objects.get(id=id)
        user.last_notification_seen = time
        user.save()
        return Response({"message": "ok"}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_experiences(request, username):
    try:
        user = get_object_or_404(User, username=username)
        profile = Profile.objects.get(user=user)
        experiences = ExperienceLog.objects.filter(profile=profile).order_by('-date_logged')[:7][::-1]
        serializer = ExperienceLogSerializer(experiences, many=True)
        return Response({'data': serializer.data, 'status': 200}, status=200)
    except Profile.DoesNotExist:
        return Response({'message': 'Profile does not exist', 'status': 404}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_score_tictac(request, username):
    try:
        user = get_object_or_404(User,username=username)
        matches_won = Game1.objects.filter(winner=user).count()
        matches_lost = Game1.objects.filter(Q(player1=user) | Q(player2=user), ~Q(winner=user), ~Q(winner__isnull=True)).count()
        total = Game1.objects.filter(Q(player1=user) | Q(player2=user)).count()
        data = {
            'matches_won': matches_won,
            'matches_lost': matches_lost,
            'total': total
        }

        return Response({'data' : data, 'status': 200}, status=200)
    except Game1.DoesNotExist:
        return Response({'message': 'Game does not exist', 'status': 404}, status=404)
    


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_matchs(requset, username):
    try:
        user = get_object_or_404(User, username=username)
        games = (Game1.objects.filter(player1=user) | Game1.objects.filter(player2=user)).order_by('-created_at')
        serializer = TicTacTeoSerializer(games, many=True)
        return Response({'data' : serializer.data, 'status': 200}, status=200)
    except Exception as e:
        return Response({'message': str(e), 'status': 404}, status=404)

