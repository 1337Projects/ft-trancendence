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
        Profile.objects.create_profile(user_id=id, online=True, level=8, bio="I'm the best player in the world", image=path, avatar=path)
    user = get_object_or_404(User, id=id)
    serialiser = UserWithProfileSerializer(user)
    return Response({"data": serialiser.data}, status=200)
