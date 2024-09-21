
# from django.shortcuts import render
from .models import Conversation
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from login.models import User
from .serializers import ConversationListSerializer
from .serializers import ConversationSerializer
from django.db.models import Q
# from django.shortcuts import redirect, reverse
# from django.http import HttpResponseForbidden
# from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def conversations(request):
    print(request.user)
    print(request.user.id)
    conversation_list = Conversation.objects.filter(Q(sender=request.user.id) |
                                                    Q(receiver=request.user.id))
    print(conversation_list)
    serializer = ConversationListSerializer(instance=conversation_list, many=True)
    print(serializer)
    # return Response(serializer.data, status=status.HTTP_200_OK)
    return JsonResponse(serializer.data, status=200, safe=False)

