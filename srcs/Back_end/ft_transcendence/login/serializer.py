from .models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    username = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'username', 'password')
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value
    def validate(self, data):
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({'username': 'Username already exists.'})
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']
        )
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)

    class Meta():
        fields = ('email', 'password')