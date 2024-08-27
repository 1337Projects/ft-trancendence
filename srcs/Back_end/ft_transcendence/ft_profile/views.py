from django.shortcuts import render, get_object_or_404
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Profile
from login.models import User
import json
import jwt
from rest_framework.exceptions import PermissionDenied, AuthenticationFailed
from django.conf import settings

class ProfileSerializers(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

def get_id(request):
    # try:
        refresh_token = request.COOKIES.get('refresh_token')
        # if not refresh_token:
        #     raise AuthenticationFailed('Missing refresh token')
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        return user_id
    # except (jwt.exceptions.DecodeError, jwt.exceptions.ExpiredSignatureError, User.DoesNotExist, AuthenticationFailed):
    #     return Response({'error': 'Invalid refresh token'}, status=401)



@api_view(['POST'])
def creat_profile(request):
    id = get_id(request)
    if Profile.objects.filter(user_id=id).exists():
        return Response({"message": "this user already exist"}, status=400)
    elif not User.objects.filter(pk=id).exists():
        return Response({"message": "this user is not exist"}, status=400)
    else:
        Profile.objects.create_profile(user_id=id, online=True, exp=0, bio='Nothing', image='', avatar='')
    return Response({"message": "Success"}, status=200)

@api_view(['GET'])
def get_infos(request):
    account = get_object_or_404(Profile, user_id=get_id(request))
    serialiser = ProfileSerializers(account, many=False)
    return Response(serialiser.data)


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
