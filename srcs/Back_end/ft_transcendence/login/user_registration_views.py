import os
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.authtoken.models import Token
from rest_framework import serializers

from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password

from .models import User
from .serializer import UserRegistrationSerializer, UserLoginSerializer
from account.utls import create_profile

from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny

from django.conf import settings

@permission_classes([AllowAny])
class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            validated_data = serializer.validated_data
            user = serializer.save()
            response = Response({
                'message':  'User created successfully',
            }, status=status.HTTP_201_CREATED)
            create_profile(user.id, f'{settings.API_URL}media/default-avatar.jpeg')
            return response
        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

from rest_framework_simplejwt.tokens import RefreshToken
from .views import  set_refresh_token_cookie
   
@permission_classes([AllowAny])
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
                if user.twofa :
                    request.session['user_id'] =  user.id
                    request.session['retry_limit'] = 5
                    request.session.set_expiry(300)
                    response = Response({"2fa": "True"}, status=status.HTTP_200_OK)
                else:    
                    refresh = RefreshToken.for_user(user)
                    refresh['username'] = user.username
                    response = Response({
                        'access': str(refresh.access_token),
                    }, status=status.HTTP_200_OK)
                    set_refresh_token_cookie(response, refresh)
                return response
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)