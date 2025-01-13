from django.urls import path
from . import views

urlpatterns = [
    path('get_friends/', views.get_friends),
    path('profile_data/', views.get_profile_infos),
    path('users/', views.get_users),
    path('experiences/', views.get_experiences),
    path('matchs', views.get_matchs),
    path('score/', views.get_score_tictac),
    path('set_profile_data/', views.set_infos),
    path('info/friends/', views.friends_infos),
    path('new_relation/', views.add_friend),
    path('accept_friend/', views.accept_friend),
    path('reject_friend/', views.reject_friend),
    path('cancle_friend/', views.unfriend),
    path('2fa/', views.set_2fa),
    path('2fa/qr/', views.generate_2fa_qr_code),
    path('2fa/topt/', views.check_topt),
    path('2fa/state/', views.is_2fa_enable),
    path('2fa/disable/', views.disable_2fa),
    path('<str:username>/', views.get_profile),
    path('getOthersFriends/<str:username>/', views.get_others_friends),
    path('setLastNotTime/time/', views.set_lst_not_time),
]