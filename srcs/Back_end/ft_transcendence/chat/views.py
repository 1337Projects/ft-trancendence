
# from django.shortcuts import render
from .models import Conversation
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from login.models import User
from .serializers import ConversationListSerializer
from .serializers import ConversationSerializer
from django.db.models import Q
# from django.shortcuts import redirect, reverse
# from rest_framework.permissions import IsAuthenticated
# from django.http import HttpResponseForbidden
from django.http import JsonResponse

# @api_view(['GET'])
# def get_conversation(request, convo_id):
#     conversation = Conversation.objects.filter(id=convo_id)
#     if not conversation.exists():
#         return Response({'message': 'Conversation does not exist'})
#     else:
#         serializer = ConversationSerializer(instance=conversation[0])
#         return Response(serializer.data)

# @api_view(['POST'])
# def start_conversations(request, ):
#     data = request.data
#     username = data.pop('username')
#     try:
#         participant = User.objects.get(username=username)
#     except User.DoesNotExist:
#         return Response({'message': 'You cannot chat with a non existent user'})

#     conversation = Conversation.objects.filter(Q(user_sender=request.user, user_receiver=participant) |
#                                                Q(user_sender=participant, user_receiver=request.user))
#     if conversation.exists():
#         return Response(ConversationSerializer(instance=conversation[0]).data)

#     else:
#         conversation = Conversation.objects.create(user_sender=request.user, user_receiver=participant)
#         return Response(ConversationSerializer(instance=conversation).data)


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def conversations(request):
    conversation_list = Conversation.objects.filter(Q(initiator=request.user.id) |
                                                    Q(receiver=request.user.id))
    serializer = ConversationListSerializer(instance=conversation_list, many=True)
    # return Response(serializer.data, status=status.HTTP_200_OK)
    return JsonResponse(serializer.data, status=200, safe=False)

