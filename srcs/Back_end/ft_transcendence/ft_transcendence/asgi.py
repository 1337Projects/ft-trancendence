"""
ASGI config for ft_transcendence project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

# import os

# from channels.routing import ProtocolTypeRouter, ChannelNameRouter
# from django.core.asgi import get_asgi_application
# from chat import routing
# from channels.routing import URLRouter, ProtocolTypeRouter
# from channels.security.websocket import AllowedHostsOriginValidator  # new
# from .tokenauth_middleware import TokenAuthMiddleware  # new


# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ft_transcendence.settings')
# application = get_asgi_application()
# application = ProtocolTypeRouter({#i added this
#     "http": get_asgi_application(),
#     "websocket": AllowedHostsOriginValidator(
#         URLRouter(
#             # chat_routing.websocket_urlpatterns  # Use the WebSocket URLs from your chat app
#             TokenAuthMiddleware(URLRouter(routing.websocket_urlpatterns)))
#     ),
# })

# application = ProtocolTypeRouter({
#     "http": get_asgi_application(),
#     "websocket": TokenAuthMiddleware(
#         URLRouter(
#             chat_routing.websocket_urlpatterns
#         )
#     ),
# })

# import os

# from channels.routing import ProtocolTypeRouter
# from django.core.asgi import get_asgi_application

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ChatAPI.settings')

# application = ProtocolTypeRouter({
#     "http": get_asgi_application(),
# })

import os

from channels.routing import URLRouter, ProtocolTypeRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
import chat.routing
# from .tokenauth_middleware import TokenAuthMiddleware
from channels.auth import AuthMiddlewareStack

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chat.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(URLRouter(chat.routing.websocket_urlpatterns)))
})
