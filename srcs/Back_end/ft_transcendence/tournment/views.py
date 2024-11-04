from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
import sys
from rest_framework.response import Response
from .serializers import TournmentSerializer, PlayerSerializer
from login.models import User


class TournmentViews(viewsets.ViewSet):

    @action(detail=False, methods=['post'])
    def create_tournment(self, request):
        try:
            username =  request.data['user']
            members =  request.data['members']
            mode = request.data['mode']

            owner = User.objects.get(username=username)

            serializer = TournmentSerializer(data={
                'max_players' : members,
                'mode' : mode,
                'owner' : owner.id
            })
            if not serializer.is_valid():
                return  Response(serializer.errors, status=400)
            serializer.save()
            
            if mode == 'local':
                players =  request.data['players']
                for player in players:
                    player_serializer = PlayerSerializer(data={'name' : player})
                    if  not player_serializer.is_valid():
                        return  Response(player_serializer.errors, status=400)
                    player_serializer.save()
                    serializer.instance.players.add(player_serializer.instance)
            return Response({"id" : serializer.data['id']}, status=200)
        except:
            return Response({"error": "Somthing went wrong"}, status=400)

    
    @action(detail=False, methods=['GET'])
    def get_tournemts(self, request):
        pass



