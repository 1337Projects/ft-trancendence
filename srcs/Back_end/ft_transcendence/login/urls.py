from django.urls import path
from . import views


urlpatterns = [
    path('google/', views.google_oauth),
    path('refresh/', views.refresh_token_view),
    path('logout/', views.logout),
    path('42/', views.intra_oauth),
    path('login/', views.login)
]    