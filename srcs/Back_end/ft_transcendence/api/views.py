from rest_framework.response import Response
from rest_framework.decorators import api_view
from login.models import User
from .serializers import UserSerializer

@api_view(['GET'])
def getData(request):
    Users = User.objects.all()
    serializer = UserSerializer(Users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def addData(request):
    serializer = UserSerializer(data=request)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)