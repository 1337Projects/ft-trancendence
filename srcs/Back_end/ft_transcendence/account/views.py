from django.shortcuts import render, get_object_or_404
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Profile, Friends
from login.models import User
from .serializer import ProfileSerializers, UserWithProfileSerializer, UserWithFriendsSerializer
import json
import jwt
from rest_framework.exceptions import PermissionDenied, AuthenticationFailed
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.db.models import Q

def get_id(request):
    refresh_token = request.COOKIES.get('refresh_token')
    if refresh_token is not None:
        payload = jwt.decode(refresh_token.encode(), settings.SECRET_KEY, algorithms=['HS256'])
        return payload['user_id']
    return None

def get_infos(id):
    user = get_object_or_404(User, id=id)
    serialiser = UserWithProfileSerializer(user)
    return serialiser

@api_view(['GET'])
def get_profile_infos(request):
    id = get_id(request)
    if not id:
        return Response({"message": "Invalid token"}, status=400)
    if not Profile.objects.filter(user_id=id).exists():
        return Response({"message": "this user is not exist", "id": id}, status=400)
    user = get_infos(id)
    return Response({"data": user.data}, status=200)

def create_profile(id, image_link):
    Profile.objects.create_profile(
        user_id=id,
        online=True, 
        level=8.7,
        bio="I'm the best player in the world",
        image=image_link,
    )


@api_view(['GET'])
def get_users(request):
    id = get_id(request)
    if not id:
        return Response({"message": "Invalid token"}, status=400)
    username = request.GET.get('query')
    users = User.objects.filter(username__startswith=username).exclude(id=id)
    serializer = UserWithProfileSerializer(users, many=True)
    return Response({"data": serializer.data}, status=200)

@api_view(['GET'])
def get_profile(request, username):
    if not User.objects.filter(username=username).exists():
        return Response({"message": "this user is not exist"}, status=400)
    user = get_object_or_404(User, username=username)
    serialiser = UserWithProfileSerializer(user)
    return Response({"data": serialiser.data}, status=200)


def manage_images(request, file_name, type):
    if default_storage.exists(file_name):
        default_storage.delete(file_name)
    avatar = default_storage.save(file_name, request.FILES[type])
    return avatar
   

@api_view(['PUT'])
def set_infos(request):
    user_infos = request.data.get('user')
    user_infos_dict = json.loads(user_infos)
    user_id = user_infos_dict.get('id')
    username = user_infos_dict.get('username')
    first_name = user_infos_dict.get('first_name')
    last_name = user_infos_dict.get('last_name')
    bio = user_infos_dict.get('profile')['bio']
    User.objects.filter(id=user_id).update(
        username=username,
        first_name=first_name,
        last_name=last_name,
    )
    if bio is not None:
        Profile.objects.filter(id=user_id).update(bio=bio)
    if 'avatar' in request.FILES:
        old_image = Profile.objects.filter(user_id=user_id).values('image').first()
        if old_image:
            default_storage.delete(old_image['image'])
        name = manage_images(request, f'{username}-profile.jpeg', 'avatar')
        Profile.objects.filter(user_id=user_id).update(
            image=f'http://127.0.0.1:8000/media/{name}'
        )
    if 'banner' in request.FILES:
        old_banner = Profile.objects.filter(user_id=user_id).values('banner').first()
        if old_banner:
            default_storage.delete(old_banner['banner'])
        name = manage_images(request, f'{username}-banner.jpeg', 'banner')
        Profile.objects.filter(user_id=user_id).update(
            banner=f'http://127.0.0.1:8000/media/{name}'
        )
    new_infos = get_infos(user_id)
    return Response({"status": 200, "res": new_infos.data}, status=200)

@api_view(['GET'])
def friends_infos(request):
    id = get_id(request)
    if not id:
        return Response({"message": "Invalid token"}, status=400)
    user = User.objects.get(id=id)
    friends = Friends.objects.filter(Q(sender=user) | Q(receiver=user))
    serializer = UserWithFriendsSerializer(friends, many=True)
    return Response({"data" : serializer.data})

@api_view(['POST'])
def add_friend(request):
    id = get_id(request)
    if not id:
        return Response({"message": "Invalid token"}, status=400)
    sender = User.objects.get(id=id)
    if 'data' in request.data:
        data = request.data.get('data')
        receiver_id = data.get('id')
        receiver = User.objects.get(id=receiver_id)
        if Friends.objects.filter(sender=sender, receiver=receiver):
            return Response({"message": "there is a relation between him"})
        else:
            Friends.objects.create(status="waiting", sender=sender, receiver=receiver).save()
            return Response({"status": 200, "id": receiver_id})
    return Response({"message": "there is no data recieved", "status": 400})

@api_view(['POST'])
def accept_friend(request):
    id = get_id(request)
    if not id:
        return Response({"message": "Invalid token"}, status=400)
    receiver = User.objects.get(id=id)
    if 'data' in request.data:
        data = request.data.get('data')
        sender_id = data.get('id')
        sender = User.objects.get(id=sender_id)
        relation_friend = Friends.objects.get(sender=sender, receiver=receiver)
        relation_friend.status = "accept"
        relation_friend.save()
        return Response({"status": 200, "message": "accept successful"})
    return Response({"message": "there is no data recieved", "status": 400})

@api_view(['POST'])
def reject_friend(request):
    id = get_id(request)
    if not id:
        return Response({"message": "Invalid token"}, status=400)
    receiver = User.objects.get(id=id)
    if 'data' in request.data:
        data = request.data.get('data')
        sender_id = data.get('id')
        sender = User.objects.get(id=sender_id)
        relation_friend = Friends.objects.get(sender=sender, receiver=receiver)
        relation_friend.status = "reject"
        relation_friend.save()
        return Response({"status": 200, "message": "reject successful"})
    return Response({"message": "there is no data recieved", "status": 400})

@api_view(['POST'])
def unfriend(request):
    id = get_id(request)
    if not id:
        return Response({"message": "Invalid token"}, status=400)
    receiver = User.objects.get(id=id)
    if 'data' in request.data:
        data = request.data.get('data')
        sender_id = data.get('id')
        sender = User.objects.get(id=sender_id)
        relationship = Friends.objects.get(sender=sender, receiver=receiver)
        relationship.delete()
        return Response({"status": 200, "message": "unfriend successul"})
    return Response({"message": "there is no data recieved", "status": 400})

    

