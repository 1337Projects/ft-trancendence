from django.urls import path
from . import views

urlpatterns = [
    path('profile_data/', views.get_profile_infos),
    path('users/', views.get_users),
    path('set_profile_data/', views.set_infos),
    path('<str:username>/', views.get_profile),
]