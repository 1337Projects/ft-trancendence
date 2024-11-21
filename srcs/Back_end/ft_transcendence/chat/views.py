
import jwt
from django.db.models import Q
from django.conf import settings
from .models import Conversation
from rest_framework import status
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.exceptions import AuthenticationFailed
from login.models import User
    
def get_id1(request):
    auth_header = request.headers.get('Authorization')    
    try:
        token = auth_header.split(' ')[1]
        decoded_data = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = decoded_data.get('user_id')
    except (jwt.PyJWTError):
        raise AuthenticationFailed('Invalid or expired token')
    return (user_id)

@api_view(['DELETE'])
def delete_conversation(request):
    id = request.data.get('conversation_id')
    conversation_list = Conversation.objects.filter(id=id)
    if not conversation_list.exists():
        return JsonResponse({'error': 'the conversation does not exist'}, status=404)
    conversation_list.delete()
    return JsonResponse({'message': 'the conversation has deleted'}, status=200)

