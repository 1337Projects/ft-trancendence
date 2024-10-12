from rest_framework import serializers
from .models import Profile, Friends
from login.serializer import UserSerializer
from login.models import User
from datetime import timedelta
from django.utils import timezone

class ProfileSerializers(serializers.ModelSerializer):
    online = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ('bio', 'level', 'avatar', 'banner', 'online')
    
    def get_online(self, obj):
        user_activity = Profile.objects.filter(user=obj.user).first()
        if user_activity:
            return user_activity.last_activity >= timezone.now() - timedelta(minutes=1)
        return False

class UserWithProfileSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'profile')
    
    def get_profile(self, obj):
        profile = Profile.objects.get(user_id=obj.id)
        return ProfileSerializers(profile).data

class UserWithFriendsSerializer(serializers.ModelSerializer):
    sender = UserWithProfileSerializer()
    receiver = UserWithProfileSerializer()

    class Meta:
        model = Friends
        fields = ('id', 'status', 'sender', 'receiver')

