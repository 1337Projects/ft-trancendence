from django.shortcuts import render, get_object_or_404
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Profile
from login.models import User
import json
import jwt
from rest_framework.exceptions import PermissionDenied
from django.conf import settings

class ProfileSerializers(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

  
def user_id(refresh_token):
    # if request.user.is_authenticated:
        # refresh_token = request.COOKIES.get('refresh_token')
        # if not refresh_token:
        #     raise PermissionDenied('User is not authenticated')
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        return User.objects.get(pk=user_id)
    # else:
    #     raise PermissionDenied('User is not authenticated')

  
@api_view(['GET'])
def get_infos(request, name):
    account = get_object_or_404(Profile, user_id=user_id(name))
    serialiser = ProfileSerializers(account, many=False)
    return Response(serialiser.data)

@api_view(['POST'])    
def creat_profile(request, name):
    if Profile.objects.filter(user__username=name).exists():
        return Response({"message": "this username already exist"}, status=400)
    else:
        try:
            player = User.objects.get(username=name)
        except User.DoesNotExist:
            Profile.objects.create(user=player, online=True, exp=0, bio='Nothing')
        return Response({"message": "Success"}, status=200)

# @api_view(['POST'])
# def set_bio(request):
#     if Profile.objects.filter(user__username=username).exists():
#        data = json.loads(request.body)
#        if len(data)!= 1 or not data.get("bio"):
#            return Response({"message": "Bad informations"}, status=400)
#        else:
#            profile = Profile.objects.get(user__username=username)
#            profile.bio = data.get("bio")
#            profile.save()
#            return Response({"message": "Bio updated successfully"}, status=200)

#     else:
#         return Response({"message": "This username don't have a account"}, status=404)
    
# @api_view(['POST'])
# def set_image(request, username):
#     if Profile.objects.filter(user__username=username).exists():
#        data = json.loads(request.body)
#        if len(data)!= 1 or not data.get("image"):
#            return Response({"message": "Bad informations"}, status=400)
#        else:
#            profile = Profile.objects.get(user__username=username)
#            profile.image = data.get("image")
#            profile.save()
#            return Response({"message": "image updated successfully"}, status=200)

#     else:
#         return Response({"message": "This username don't have a account"}, status=404)

# @api_view(['POST'])
# def set_avatar(request, username):
#     if Profile.objects.filter(user__username=username).exists():
#        data = json.loads(request.body)
#        if len(data)!= 1 or not data.get("avatar"):
#            return Response({"message": "Bad informations"}, status=400)
#        else:
#            profile = Profile.objects.get(user__username=username)
#            profile.avatar = data.get("avatar")
#            profile.save()
#            return Response({"message": "avatr updated successfully"}, status=200)

#     else:
#         return Response({"message": "This username don't have a account"}, status=404)

        



