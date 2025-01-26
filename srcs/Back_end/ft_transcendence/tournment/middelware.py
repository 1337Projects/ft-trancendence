
import jwt, sys
from django.contrib.auth.models import AnonymousUser
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
            return AnonymousUser()

    async def __call__(self, scope, receive, send):
        query_str = scope['query_string'].decode()
        query_params = parse_qs(query_str)
        token = query_params.get("token", [None])[0]

        if token:
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                user_id = payload['user_id']
                scope['user'] = await self.get_user(user_id)
            except Exception as e:
                print(e)
                sys.stdout.flush()
                scope['user'] = AnonymousUser()
        else:
            scope['user'] = AnonymousUser()
        return  await self.inner(scope, receive, send)
        
