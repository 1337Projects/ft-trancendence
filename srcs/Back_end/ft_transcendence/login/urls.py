from django.urls import path
from . import views


urlpatterns = [
    path('refresh/', views.refresh_token_view),
    path('logout/', views.logout),
    path('oauth/intra/', views.intra_oauth),
]