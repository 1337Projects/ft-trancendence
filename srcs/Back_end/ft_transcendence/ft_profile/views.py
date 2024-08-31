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


def get_id(request):
    refresh_token = request.COOKIES.get('refresh_token')
    if refresh_token is not None:
        payload = jwt.decode(refresh_token.encode(), settings.SECRET_KEY, algorithms=['HS256'])
        return payload['user_id']
    return None

@api_view(['GET'])
def get_infos(request):
    id = get_id(request)
    if not id:
        return Response({"message": "Invalid token"}, status=400)
    if not User.objects.filter(pk=id).exists():
        return Response({"message": "this user is not exist", "id": id}, status=400)
    if not Profile.objects.filter(user_id=id).exists():
        path = "http://127.0.0.1:8000/static/mel-harc.jpeg"
        Profile.objects.create_profile(user_id=id, online=True, level=8.7, bio="I'm the best player in the world", image=path, avatar=path)
    user = get_object_or_404(User, id=id)
    serialiser = UserWithProfileSerializer(user)
    return Response({"data": serialiser.data}, status=200)

@api_view(['POST'])
def get_users(request):
    data = json.loads(request.body)
    if len(data) != 1 or not data.get("username"):
        return Response({"message": "Bad informations"}, status=400)
    users = User.objects.filter(username__startswith=data.get("username"))
    usernames = [user.username for user in users]
    return Response({"data": usernames}, status=200)

@api_view(['GET'])
def get_profile(request, username):
    if not User.objects.filter(username=username).exists():
        return Response({"message": "this user is not exist"}, status=400)
    user = get_object_or_404(User, username=username)
    serialiser = UserWithProfileSerializer(user)
    return Response({"data": serialiser.data}, status=200)