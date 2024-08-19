from django.urls import path
from . import views


urlpatterns = [
    path('google/', views.google_oauth),
    path('42/', views.intra_oauth),
]