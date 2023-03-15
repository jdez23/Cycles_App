from .credentials import *
from .util import *

from requests import Request, post

from rest_framework.views import APIView
from rest_framework import status, authentication, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class SpotifyAuthURL(APIView):
    authentication_class = [authentication.TokenAuthentication]
    permission_class = [permissions.IsAuthenticated]

    def get(self, request):

        scopes = 'user-library-read playlist-read-private'
        url = Request('GET', 'https://accounts.spotify.com/authorize',
                      params={
                          'scope': scopes,
                          'response_type': 'code',
                          'redirect_uri': REDIRECT_URL,
                          'client_id': CLIENT_ID
                      }
                      ).prepare().url
        return Response(url, status=status.HTTP_200_OK)


class SpotifyCallback(APIView):
    authentication_class = [authentication.TokenAuthentication]
    permission_class = [permissions.IsAuthenticated]

    def post(self, request):
        code = request.data.get('code')

        if not code:
            return Response({'Error': 'Code not found in request'}, status=status.HTTP_400_BAD_REQUEST)

        response = post('https://accounts.spotify.com/api/token', data={
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': REDIRECT_URL,
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET
        }).json()

        if not response:
            return Response({'error': 'Spotify request failed!'}, status=response.status_code)
        return Response(response, status=status.HTTP_200_OK)


class LoginSpotify(APIView):
    authentication_class = [authentication.TokenAuthentication]
    permission_class = [permissions.IsAuthenticated]

    def post(self, request):
        access_token = request.data.get('access_token')
        refresh_token = request.data.get('refresh_token')
        expires_in = request.data.get('expires_in')
        token_type = request.data.get('token_type')

        user = self.request.user

        update_or_create_user_tokens(
            user, access_token, refresh_token, expires_in, token_type)

        return Response(status=status.HTTP_200_OK)

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs['context'] = self.get_serializer_context()
        return serializer_class(*args, **kwargs)


class IsSpotifyAuthenticated(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = self.request.user
        is_authenticated = is_spotify_authenticated(user)
        return Response(is_authenticated, status=status.HTTP_200_OK)


# get users playlists from spotify
class SpotifyPlaylist(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = self.request.user
        endpoint = "v1/me/playlists"
        response = execute_spotify_api_request(user, endpoint)

        return Response(response, status=status.HTTP_200_OK)


# get tracks in users spotify playlist
class PlaylistTracks(APIView):
    def get_playlists_tracks(self):
        endpoint = "v1/playlists/{playlist_id}/tracks"
        access_token = self.get_access_token()
        headers = {
            "Authorization": f"Bearer {access_token}"
        }
        return Response(status=status.HTTP_200_OK)


class SpotifySearch(APIView):
    def search(self, token):
        endpoint = "v1/search"
        access_token = self.get_access_token()
        headers = {
            "Authorization": f"Bearer {access_token}"
        }
        return Response(status=status.HTTP_200_OK)
