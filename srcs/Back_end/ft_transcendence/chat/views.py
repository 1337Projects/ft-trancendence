
import jwt
from django.db.models import Q
from django.conf import settings
from .models import Conversation, Message
from rest_framework import status
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.exceptions import AuthenticationFailed
from account.serializer import UserWithProfileSerializer
from .serializers import ConversationListSerializer , ConversationSerializer 
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

@api_view(['GET'])
def conversations(request):
    conversation_list = Conversation.objects.filter(Q(sender=get_id1(request)) |
                                                    Q(receiver=get_id1(request)))
    serializer = ConversationListSerializer(instance=conversation_list, many=True)
    return JsonResponse({"data": serializer.data}, status=200)

@api_view(['DELETE'])
def delete_conversation(request):
    id = request.data.get('conversation_id')
    conversation_list = Conversation.objects.filter(id=id)
    if not conversation_list.exists():
        return JsonResponse({'error': 'the conversation does not exist'}, status=404)
    conversation_list.delete()
    return JsonResponse({'message': 'the conversation has deleted'}, status=200)


@api_view(['GET'])
def search_friends_with_conversation(request):#ask abdelhadi for what he will send
    name = request.GET.get('name')
    id = get_id1(request)
    friends= User.objects.filter(
        username__startswith=name
    ).exclude(id=id)# hadi list dyal l friends dyawli
    if not friends.exists():
        return JsonResponse({'message': 'no friend found'}, status=400)
    conversation_list = Conversation.objects.filter(
        Q(sender=id) |
        Q(receiver=id)
    ).values('sender', 'receiver')#hadi list dyal les conversations li3ndi
    if conversation_list.none():
        return JsonResponse({'message': 'no conversation found'}, status=400)
    conversation_with_friend = []
    for friend in friends:
        conversation = conversation_list.filter(
            Q(sender=friend.id) |
            Q(receiver=friend.id)
        )
        if conversation.exists():
            conversation_with_friend.extend(conversation)
    if not conversation_with_friend:
        return JsonResponse({'message': 'no conversation with friend is found'}, status=400)
    serializer = ConversationSerializer(conversation_with_friend, many=True)
    return JsonResponse({'message': serializer.data}, status=200) # UserWithProfileSerializer
