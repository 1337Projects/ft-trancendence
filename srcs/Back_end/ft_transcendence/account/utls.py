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
from PIL import Image
from django.core.exceptions import ValidationError

default_banner = f"{settings.API_URL}media/default-bannerr.jpeg"
default_avatar = f"{settings.API_URL}media/default-avatar.jpeg"

def manage_images(user_id, request, type):
    file_url = Profile.objects.filter(user_id=user_id).values(type).first()
    if file_url and file_url[type] != default_banner and file_url[type] != default_avatar:
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

def validate_totp(user, otp):
    secret_key = user.secret_key
    totp = pyotp.TOTP(secret_key)
    return totp.verify(otp)

def check_format(file):
    try:
        img = Image.open(file)
        img.verify()
        if img.format not in ['JPEG', 'PNG', 'GIF']:
            return "Unsupported file format. Only JPEG, PNG, and GIF are allowed."
        else:
            return 'valid format'
    except Exception as e:
        raise e





