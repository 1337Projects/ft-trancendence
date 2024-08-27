from django.urls import path
from . import views

urlpatterns = [
    path('infos/<str:name>/', views.get_infos),
    path('create/', views.creat_profile),
#     path('bio/', views.set_bio),
#     path('image/', views.set_image),
#     path('avatar/', views.set_avatar),
]