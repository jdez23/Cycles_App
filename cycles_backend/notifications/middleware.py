from urllib.parse import parse_qs

from channels.auth import AuthMiddleware
from channels.db import database_sync_to_async
from channels.sessions import CookieMiddleware, SessionMiddleware

from users.models import User
from django.contrib.auth.models import AnonymousUser


@database_sync_to_async
def get_user(scope):
    query_string = parse_qs(scope['query_string'].decode())
    token = query_string.get('token')[0]
    if not token:
        return AnonymousUser()
    try:
        user = User.objects.get(firebase_id=token)

    except Exception as exception:
        return AnonymousUser()
    if not user.is_active:
        return AnonymousUser()
    return user


class TokenAuthMiddleware(AuthMiddleware):
    async def resolve_scope(self, scope):
        scope['user']._wrapped = await get_user(scope)


def TokenAuthMiddlewareStack(inner):
    return CookieMiddleware(SessionMiddleware(TokenAuthMiddleware(inner)))
