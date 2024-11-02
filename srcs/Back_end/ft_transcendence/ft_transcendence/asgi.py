
import os

from channels.routing import URLRouter, ProtocolTypeRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
import chat.routing
from tournment import urls as tournment
# from .tokenauth_middleware import TokenAuthMiddleware
from channels.auth import AuthMiddlewareStack

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chat.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(URLRouter(
            chat.routing.websocket_urlpatterns +
            tournment.websocket_urlpatterns
        )))
})
