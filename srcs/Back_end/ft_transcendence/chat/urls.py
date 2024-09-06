from django.urls import path
from . import views
from login.views import google_login, google_oauth

urlpatterns = [
    path('conversations/', views.conversations),
    # path('conversations/start', views.start_conversations),
    path('conversations/<int:convo_id>/', views.get_conversation),
]