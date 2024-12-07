from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
import sys
from rest_framework.response import Response
from .serializers import TournmentSerializer
from login.models import User
from .models import Tournment


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
            return Response({"id" : serializer.data['id']}, status=200)
        except:
            return Response({"error": "Somthing went wrong"}, status=400)

    
    @action(detail=False, methods=['GET'])
    def get_tournemts(self, request):
        tournments = Tournment.objects.all()
        data = TournmentSerializer(tournments, many=True)
        return Response({"data" : data.data}, status=200)



