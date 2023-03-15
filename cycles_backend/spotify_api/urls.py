from django.urls import path

from .views import *

urlpatterns = [
    path('get-auth-url/', SpotifyAuthURL.as_view()),
    path('token-request/', SpotifyCallback.as_view()),
    path('spotify_login/', LoginSpotify.as_view()),
    path('token/', IsSpotifyAuthenticated.as_view()),
    path('spotify-playlist/', SpotifyPlaylist.as_view()),
]
