
import os

from channels.routing import URLRouter, ProtocolTypeRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
import chat.routing
import game.routing
import notifications.routing
from tournment import urls as tournment
from tournment.middelware import MyMiddelware

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
        MyMiddelware(
            URLRouter(
                chat.routing.websocket_urlpatterns +
                notifications.routing.websocket_urlpatterns +
                tournment.websocket_urlpatterns +
                game.routing.websocket_urlpatterns
            )
        )
    )
})
