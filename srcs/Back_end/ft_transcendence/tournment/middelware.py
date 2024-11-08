
import jwt, sys
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from login.models import User

from django.conf import settings

class MyMiddelware:

    def __init__(self, inner):
        self.inner = inner

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            
            user = User.objects.get(id=user_id)
            return user
        except:
            return None

    async def __call__(self, scope, receive, send):
        query_str = scope['query_string'].decode()
        query_params = parse_qs(query_str)
        token = query_params.get("token", [None])[0]

        if token:
            # print(settings.SECRET_KEY)
            # print(token)
            # sys.stdout.flush()
            try:
                # payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                user_id = 1
                scope['user'] = await self.get_user(user_id)
            except:
                # print("exeption has been throwen")
                # sys.stdout.flush()
                scope['user'] = None
        else:
            scope['user'] = None
        return await self.inner(scope, receive, send)
