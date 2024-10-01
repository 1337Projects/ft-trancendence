from django.shortcuts import get_object_or_404
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.core.files.storage import default_storage
from .models import Profile, Friends
from .serializer import UserWithProfileSerializer
from login.models import User
import jwt

def manage_images(request, file_name, type):
    if default_storage.exists(file_name):
        default_storage.delete(file_name)
    avatar = default_storage.save(file_name, request.FILES[type])
    return avatar

def create_profile(id, image_link):
    Profile.objects.create_profile(
        user_id=id,
        online=True, 
        level=8.7,
        bio="I'm the best player in the world",
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
        