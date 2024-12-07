from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'login.html')


def match_makign(request):
    return render(request, 'match_making.html')

def game(request, game_id):
    return render(request, 'game.html', {'game_id': game_id})
