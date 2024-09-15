from rest_framework import serializers
from .models import Profile, Friends
from login.serializer import UserSerializer
from login.models import User

class ProfileSerializers(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('bio', 'level', 'image', 'avatar', 'online')

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