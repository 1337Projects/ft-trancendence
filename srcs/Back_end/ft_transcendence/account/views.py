from django.shortcuts import render, get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Profile, Friends
from login.models import User
from login.views import check_if_duplicate 
from .serializer import ProfileSerializers, UserWithProfileSerializer, UserWithFriendsSerializer
import json, jwt, sys
from rest_framework.exceptions import PermissionDenied, AuthenticationFailed
from django.conf import settings
from login.views import generate_access_token, generate_refresh_token, set_refresh_token_cookie
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from .utls import *
from datetime import timedelta

import qrcode
import pyotp, os, io
from django.core.files.base import ContentFile
from django_otp.plugins.otp_totp.models import TOTPDevice

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
    id = get_id(request)
    if not id:
        return Response({"message": "Invalid token"}, status=400)
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
    # user_id = user_infos_dict.get('id')
    print(f"{request.user}")
    sys.stdout.flush()
    user_id = id
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
            avatar=f'http://127.0.0.1:8000/media/{name}'
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

@api_view(['POST'])
def set_2fa(request):
    id = get_id(request)
    if not id:
        return Response({"message": "Invalid token"}, status=400)
    user = User.objects.get(id=id)
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



@csrf_exempt
@api_view(['GET'])
def generate_2fa_qr_code(request):
    id = get_id(request)
    if not id:
        return Response({"message": "Invalid token"}, status=400)
    user = User.objects.get(id=id)
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

    return Response({"qr_code_image": "http://localhost:8000/media/" + file_name}, status=200)


@api_view(['POST'])
def check_topt(request):
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
                access_token = generate_access_token(user)
                refresh_token = generate_refresh_token(user)
                response = JsonResponse({"access": access_token, "message": "Successful", "status":200}, status=200)
                set_refresh_token_cookie(response, refresh_token)
                return response
            else:
                request.session['retry_limit'] -= 1
                return JsonResponse({"status": 400, "message": "Invalid TOPT",}, status=400)
        else:
            return JsonResponse({"status": 400, "message": "Invalid data"}, status=400)
    else:
        return JsonResponse({"status": 400, "message": "Invalid data"}, status=400)
    
@api_view(['GET'])
def is_2fa_enable(request):
    id = get_id(request)
    if not id:
        return Response({"message": "Invalid token"}, status=400)
    user = get_object_or_404(User, id=id)
    if user.twofa:
        return Response({"2fa" : "True"}, status=200)
    else:
        return Response({"2fa" : "False"}, status=200)
    
@api_view(['PATCH'])
def disable_2fa(request):
    id = get_id(request)
    if not id:
        return Response({"message": "Invalid token"}, status=400)
    user = get_object_or_404(User, id=id)
    user.twofa = False
    user.secret_key = None
    user.save()
    return JsonResponse({'status': '200', 'message': 'Secret key deleted successfully'}, status=200)


# @api_view(['GET'])
# def get_others_friends(request, username):
#     id = get_id(request)
#     if not id:
#         return Response({"message": "Invalid token"}, status=400)
#     try:
#         user = User.objects.get(username=username)# user you are viewing his friends
#         current_user = User.objects.get(id=id) # iuser who is logging in
#     except User.DoesNotExist:
#         return Response({"message": "this user is not exist"}, status=404)

#     friends_filter  = Friends.objects.filter(Q(sender=user) | Q(receiver=user), status='accept')

#     friend_ids = list(friends_filter.values_list('sender', flat=True)) + list(friends_filter.values_list('receiver', flat=True))
#     friend_ids = list(set(friend_ids))  # Convert to set to remove duplicates

#     if current_user.id in friend_ids:
#         friend_ids.remove(current_user.id)

#     print("my_id :", id, "other's_id:" ,current_user.id , "friends:", friend_ids)
#     friends = User.objects.filter(id__in=friend_ids)
#     serializer = UserWithProfileSerializer(friends  , many=True)

#     return Response({"data" : serializer.data})

#?query=${query
@api_view(['GET'])
def get_others_friends(request, username):
    id = get_id(request)
    if not id:
        return Response({"message": "Invalid token"}, status=400)
    try:
        user = User.objects.get(username=username)# user you are viewing his friends
        current_user = User.objects.get(id=id) # iuser who is logging in
    except User.DoesNotExist:
        return Response({"message": "this user is not exist"}, status=404)

    friends_filter  = Friends.objects.filter(Q(sender=user) | Q(receiver=user), status='accept').exclude(
        Q(sender=current_user, receiver=user)  | Q(sender=user, receiver=current_user)
    )
    serializer = UserWithFriendsSerializer(friends_filter , many=True)
    return Response({"data" : serializer.data})
