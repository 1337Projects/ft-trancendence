
import jwt
from django.db.models import Q
from django.conf import settings
from .models import Conversation
from rest_framework import status
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .serializers import ConversationListSerializer
from rest_framework.exceptions import AuthenticationFailed
    
def get_id(request):
    auth_header = request.headers.get('Authorization')    
    try:
        token = auth_header.split(' ')[1]
        decoded_data = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = decoded_data.get('user_id')
    except (jwt.PyJWTError):
        raise AuthenticationFailed('Invalid or expired token')
    return (user_id)

@api_view(['GET'])
def conversations(request):
    conversation_list = Conversation.objects.filter(Q(sender=get_id(request)) |
                                                    Q(receiver=get_id(request)))
    serializer = ConversationListSerializer(instance=conversation_list, many=True)
    return JsonResponse({"data": serializer.data}, status=200)
