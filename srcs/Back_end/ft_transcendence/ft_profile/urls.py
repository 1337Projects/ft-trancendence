from django.urls import path
from . import views

urlpatterns = [
    path('infos/', views.get_profile_infos),
    path('users/', views.get_users),
    path('settings/', views.set_infos),
    path('<str:username>/', views.get_profile),
]