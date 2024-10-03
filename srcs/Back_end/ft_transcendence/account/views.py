from django.shortcuts import render, get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Profile, Friends
from login.models import User
from login.views import check_if_duplicate 
from .serializer import ProfileSerializers, UserWithProfileSerializer, UserWithFriendsSerializer
import json, jwt
from rest_framework.exceptions import PermissionDenied, AuthenticationFailed
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from .utls import *



@api_view(['GET'])
def get_profile_infos(request):
    id = get_id(request)
    if not id:
        return Response({"message": "Invalid token"}, status=400)
    if not Profile.objects.filter(user_id=id).exists():
        return Response({"message": "this user is not exist", "id": id}, status=400)
    user = get_infos(id)
    return Response({"data": user.data}, status=200)

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

@api_view(['PUT'])
def set_infos(request):
    id = get_id(request)
    if not id:
        return Response({"message": "Invalid token"}, status=400)
    user_infos = request.data.get('user')
    user_infos_dict = json.loads(user_infos)
    user_id = user_infos_dict.get('id')
    username = user_infos_dict.get('username')
    first_name = user_infos_dict.get('first_name')
    last_name = user_infos_dict.get('last_name')
    bio = user_infos_dict.get('profile')['bio']
    if check_duplicate_username(username=username, id=id):
        return Response({"status": 400, "res": get_infos(user_id).data ,"message": "This username is duplicated"}, status=400)
    User.objects.filter(id=user_id).update(
        username=username,
        first_name=first_name,
        last_name=last_name,
    )
    if bio is not None:
        Profile.objects.filter(id=user_id).update(bio=bio)
    if 'avatar' in request.FILES:
        name = manage_images(user_id, request, 'avatar')
        Profile.objects.filter(user_id=user_id).update(
            image=f'http://127.0.0.1:8000/media/{name}'
        )
    if 'banner' in request.FILES:
        name = manage_images(user_id, request, 'banner')
        Profile.objects.filter(user_id=user_id).update(
            banner=f'http://127.0.0.1:8000/media/{name}'
        )
    return Response({"status": 200, "res": get_infos(user_id).data}, status=200)

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
        if Friends.objects.filter(Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender)):
            return Response({"message": "there is a relation between him"}, status=400)
        else:
            new_relation = Friends.objects.create(status="waiting", sender=sender, receiver=receiver)
            new_relation.save()
            serializer = UserWithFriendsSerializer(new_relation)
            return Response({"status": 200, "res": serializer.data})
    else:
        return Response({"message": "there is no data recieved", "status": 400}, status=400)

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
        relationship = Friends.objects.filter(sender=receiver, receiver=sender)
        if relationship:
            return Response({"status": 400, "message": "can't serve this request"})
        try:
            relation_friend = Friends.objects.get(sender=sender, receiver=receiver)
            relation_friend.status = "accept"
            relation_friend.save()
            serializer = UserWithFriendsSerializer(relation_friend)
            return Response({"status": 200, "message": serializer.data})
        except ObjectDoesNotExist:
            return Response({"status": 400, "message": "the Friends object does not exist"})
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
        relationship = Friends.objects.filter(sender=receiver, receiver=sender)
        if relationship:
            return Response({"status": 400, "message": "can't serve this request"})
        try:
            relation_friend = Friends.objects.get(sender=sender, receiver=receiver)
            query_id = relation_friend.id
            relation_friend.delete()
            return Response({"status": 200, "message": "reject successful", "id": query_id})
        except ObjectDoesNotExist:
            return Response({"status": 400, "message": "the Friends object does not exist"})
    return Response({"message": "there is no data recieved", "status": 400})

@api_view(['POST'])
def unfriend(request):
    id = get_id(request)
    if not id:
        return Response({"message": "Invalid token"}, status=400)
    sender = User.objects.get(id=id)
    if 'data' in request.data:
        data = request.data.get('data')
        receiver_id = data.get('id')
        receiver = User.objects.get(id=receiver_id)
        try :
            relationship = Friends.objects.get(Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender))
            query_id = relationship.id 
            relationship.delete()
            return Response({"status": 200, "message": "unfriend successul", "id": query_id})
        except ObjectDoesNotExist:
            return Response({"status": 400, "message": "the Friends object does not exist"})
    return Response({"message": "there is no data recieved", "status": 400})

    
@api_view(['GET'])
def get_friends(request):
    id = get_id(request)
    if not id:
        return Response({"message": "Invalid token"}, status=400)
    user = User.objects.get(id=id)
    friends = Friends.objects.filter(Q(sender=user) | Q(receiver=user), status='accept')
    serializer = UserWithFriendsSerializer(friends, many=True)
    return Response({"data" : serializer.data})
