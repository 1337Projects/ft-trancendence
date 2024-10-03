from django.shortcuts import get_object_or_404
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.core.files.storage import default_storage
from .models import Profile, Friends
from .serializer import UserWithProfileSerializer
from login.models import User
import jwt, uuid, os
from urllib.parse import urlparse

default_banner = "http://127.0.0.1:8000/media/default-banner.jpg"

def manage_images(user_id, request, type):
    file_url = Profile.objects.filter(user_id=user_id).values('banner').first()
    if file_url and file_url['banner'] != default_banner:
        file_name = os.path.basename(urlparse(file_url['banner']).path)
        if default_storage.exists(file_name):
            default_storage.delete(file_name)
    file_name = f"{uuid.uuid4()}-banner.jpeg"
    avatar = default_storage.save(file_name, request.FILES[type])
    return avatar

def create_profile(id, image_link):
    Profile.objects.create_profile(
        user_id=id,
        online=True, 
        level=0,
        bio="Nothing",
        banner=default_banner,
        image=image_link,
    )

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

def check_duplicate_username(username, id):
    try:
        user = User.objects.get(username=username)
        if id != user.id:
            return True
        return False
    except ObjectDoesNotExist:
        return False
        