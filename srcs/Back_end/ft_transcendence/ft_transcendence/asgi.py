
import os

from channels.routing import URLRouter, ProtocolTypeRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
import chat.routing
import game.routing as game
# from game_api import urls as game
import notifications.routing
# from tournment import urls as tournment
# from .tokenauth_middleware import TokenAuthMiddleware
from tournment.middelware import MyMiddelware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chat.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
        MyMiddelware(
            URLRouter(
                chat.routing.websocket_urlpatterns +
                # tournment.websocket_urlpatterns +
                notifications.routing.websocket_urlpatterns +
                game.websocket_urlpatterns
            )
        )
    )
})
