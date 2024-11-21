from django.shortcuts import get_object_or_404
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.core.files.storage import default_storage
from .models import Profile, Friends
from .serializer import UserWithProfileSerializer
from login.models import User
import jwt, uuid, os
from urllib.parse import urlparse
from django.utils import timezone
import pyotp
from functools import wraps
from django.http import JsonResponse


default_banner = "http://127.0.0.1:8000/media/default-banner.jpg"

def manage_images(user_id, request, type):
    file_url = Profile.objects.filter(user_id=user_id).values(type).first()
    if file_url and file_url[type] != default_banner:
        file_name = os.path.basename(urlparse(file_url[type]).path)
        if default_storage.exists(file_name):
            default_storage.delete(file_name)
    file_name = f"{uuid.uuid4()}-{type}.jpeg"
    avatar = default_storage.save(file_name, request.FILES[type])
    return avatar

def create_profile(id, image_link):
    Profile.objects.create_profile(
        user_id=id,
        level=0,
        bio="Nothing",
        banner=default_banner,
        avatar=image_link,
    )

def get_id(request):
    refresh_token = request.COOKIES.get('refresh_token')
    if refresh_token is not None:
        payload = jwt.decode(refresh_token.encode(), settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload['user_id']
        update_time_activity(user_id=user_id)
        return user_id
    return None

def get_infos(id):
    user = get_object_or_404(User, id=id)
    serialiser = UserWithProfileSerializer(user)
    return serialiser

def check_duplicate_username(username, id):
    try:
        user = User.objects.get(username=username)
        if id != user.id:
            return True
        return False
    except ObjectDoesNotExist:
        return False

def update_time_activity(user_id):
    try:
        profile = Profile.objects.get(user_id=user_id)
        profile.last_activity = timezone.now()
        profile.save()
    except ObjectDoesNotExist:
        print(f"Profile with user_id {user_id} does not exist.")

def validate_totp(user, otp):
    secret_key = user.secret_key
    totp = pyotp.TOTP(secret_key)
    return totp.verify(otp)





