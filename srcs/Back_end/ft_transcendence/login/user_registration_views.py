from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.authtoken.models import Token
from rest_framework import serializers

from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password

from .models import User
from .serializer import UserRegistrationSerializer, UserLoginSerializer


class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            validated_data = serializer.validated_data
            # validated_data['password'] = make_password(validated_data['password'])
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserRegistrationSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

from rest_framework_simplejwt.tokens import RefreshToken

class UserLoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = authenticate(
                username=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)