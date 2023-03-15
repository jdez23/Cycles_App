from rest_framework.permissions import BasePermission

from .util import is_spotify_authenticated


class HasSpotifyToken(BasePermission):
    def has_permission(self, request, view):
        return is_spotify_authenticated(request.user)
