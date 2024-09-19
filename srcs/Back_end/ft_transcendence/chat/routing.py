

from django.urls import path , re_path
from . import consumers

websocket_urlpatterns = [
    path('ws/chat/<str:user_id>/<str:partner_id>/', consumers.PrivateChatConsumer.as_asgi()),
]

    # path('ws/chat/<int:user_id>/<int:partner_id>/', consumers.PrivateChatConsumer.as_asgi()),
#     path(r'ws/chat/(?P<user_id>\d+)/(?P<partner_id>\d+)/$', consumers.PrivateChatConsumer.as_asgi()),