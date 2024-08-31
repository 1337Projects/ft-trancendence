from django.urls import path
from . import views

urlpatterns = [
    path('infos/', views.get_infos),
    path('users/', views.get_users),
    path('<str:username>/', views.get_profile),

]