from rest_framework import serializers
from .models import Profile
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

# class SearchUserSerializer(serializers.ModelSerializer):
#     info_profile = serializers.SerializerMethodField()

#     class Meta:
#         model = User
#         fields = ['username', 'first_name', 'last_name', 'info_profile']

#     def get_info_profile(self, obj):
#         profile = obj.profile
#         return {
#             'level': profile.level,
#             'image': profile.image,
#         }
    