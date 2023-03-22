import firebase_admin
from firebase_admin import auth, credentials

from django.conf import settings

from rest_framework import authentication

from users.models import User

from .exceptions import FirebaseError
from .exceptions import InvalidAuthToken
from .exceptions import NoAuthToken


cred = credentials.Certificate(settings.FIREBASE_CONFIG)
firebase_admin.initialize_app(cred)


class FirebaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        fb_id = request.META.get('HTTP_AUTHORIZATION')
        if not fb_id:
            raise NoAuthToken("No auth token provided")
        user = User.objects.get(firebase_id=fb_id)
        return (user, None)
