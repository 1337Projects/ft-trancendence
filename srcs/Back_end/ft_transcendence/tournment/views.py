from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import TournmentSerializer
from login.models import User
from .models import Tournment

class TournmentViews(viewsets.ViewSet):

    @action(detail=False, methods=['post'])
    def create_tournment(self, request):
        try:
            members =  request.data['members']
            tournament_name = request.data['name']

            serializer = TournmentSerializer(data={
                'max_players' : members,
                'tournament_name' : tournament_name
            })
            if not serializer.is_valid():
                return  Response(serializer.errors, status=400)
            serializer.save()
            return Response({"id" : serializer.data["id"]}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

    
    @action(detail=False, methods=['GET'])
    def get_tournemts(self, request):
        tournments = Tournment.objects.filter(tourament_status='waiting')
        data = TournmentSerializer(tournments, many=True)
        return Response({"data" : data.data}, status=200)



