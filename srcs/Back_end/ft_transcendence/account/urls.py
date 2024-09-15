from django.urls import path
from . import views

urlpatterns = [
    path('profile_data/', views.get_profile_infos),
    path('users/', views.get_users),
    path('set_profile_data/', views.set_infos),
    path('info/friends/', views.friends_infos),
    path('new_relation/', views.add_friend),
    path('accept_friend/', views.accept_friend),
    path('reject_friend/', views.reject_friend),
    path('cancle_friend/', views.unfriend),
    path('<str:username>/', views.get_profile),
]