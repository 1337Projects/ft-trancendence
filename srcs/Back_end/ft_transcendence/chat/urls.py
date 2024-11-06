from django.urls import path
from . import views

urlpatterns = [
    path('conversations/', views.conversations),
    path('deleteConversations/', views.delete_conversation),
    # path('searchInConversation/', views.search_friends_with_conversation),
]