from django.urls import path
from . import views

urlpatterns = [
    path('conversations/', views.conversations),
    # path('conversations/start', views.start_conversations),
    # path('conversations/<int:convo_id>/', views.get_conversation),
]