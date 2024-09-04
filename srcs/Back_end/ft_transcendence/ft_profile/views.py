from django.shortcuts import render, get_object_or_404
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Profile
from login.models import User
from .serializer import ProfileSerializers, UserWithProfileSerializer
import json
import jwt
from rest_framework.exceptions import PermissionDenied, AuthenticationFailed
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage

@api_view(['PUT'])
@csrf_exempt
def set_settings_info(request):
    return Response({"data": request.data})


def get_id(request):
    refresh_token = request.COOKIES.get('refresh_token')
    if refresh_token is not None:
        payload = jwt.decode(refresh_token.encode(), settings.SECRET_KEY, algorithms=['HS256'])
        return payload['user_id']
    return None

@api_view(['GET'])
def get_profile_infos(request):
    id = get_id(request)
    if not id:
        return Response({"message": "Invalid token"}, status=400)
    if not Profile.objects.filter(user_id=id).exists():
        return Response({"message": "this user is not exist", "id": id}, status=400)
    user = get_object_or_404(User, id=id)
    serialiser = UserWithProfileSerializer(user)
    return Response({"data": serialiser.data}, status=200)

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
    username = request.GET.get('query')
    users = User.objects.filter(username__startswith=username)
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
    avatar = default_storage.save(f'static/{username}.jpeg', request.FILES['avatar'])
    return Response({"username": repr(request.data)})
