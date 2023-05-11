import os
import environ
from rest_framework import viewsets, status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from spotify_api.util import execute_spotify_api_request, is_spotify_authenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
from rest_framework import generics
from .serializers import *
from .models import *
from django.http import JsonResponse
from users.models import Follow
from google.oauth2 import service_account
from google.cloud import storage

# Create your views here.


# GET ALL PLAYLISTS (DISCOVER FEED)
class PlaylistViewSet(viewsets.ModelViewSet):
    serializer_class = UserPlaylistSerializer

    def get_queryset(self):
        try:
            playlist = Playlist.objects.all().order_by('?')
            return playlist
        except:
            return Response(status=500)


# GET PLAYLIST DETAILS
class PlaylistDetails(APIView):
    queryset = Playlist.objects.all()

    def get(self, request):

        try:
            playlist_id = request.GET.get('id')

            playlist = Playlist.objects.get(id=playlist_id)
            playlist_serializer = PlaylistDetailSerializer(playlist)

            tracks = PlaylistTracks.objects.filter(playlist_id=playlist.id)
            tracks_serializer = PlaylistTracksSerializer(tracks, many=True)

            playlistDetails = {'playlistDetails': playlist_serializer.data,
                               'playlistTracks': tracks_serializer.data}

            return Response(playlistDetails, status=status.HTTP_200_OK)
        except:
            return JsonResponse({'error': 'An unexpected error occurred.'}, status=500)


# GET SPECIFIC USERS PLAYLISTS (PROFILE SCREEN)
class UserPlaylists(APIView):
    serializer_class = UserPlaylistSerializer

    def get(self, request):
        try:
            user = request.GET.get('id')
            playlist = Playlist.objects.filter(user_id=user)
            serializer = UserPlaylistSerializer(playlist, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return JsonResponse({'error': 'An unexpected error occurred.'}, status=500)


# DELETE, GET & POST MY PLAYLISTS
class MyPlaylists(APIView):
    queryset = Playlist.objects.all()
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        try:
            user = self.request.user
            playlist = Playlist.objects.filter(user=user)
            serializer = PlaylistSerializer(playlist, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return JsonResponse({'error': 'An unexpected error occurred.'}, status=500)

    def post(self, request):

        try:
            form_data = request.data

            user = self.request.user
            images = request.FILES.getlist('images')
            description = form_data.get('description')
            playlist_url = form_data.get('playlist_url')
            playlist_ApiURL = form_data.get('playlist_ApiURL')
            playlist_id = form_data.get('playlist_id')
            playlist_cover = form_data.get('playlist_cover')
            playlist_title = form_data.get('playlist_title')
            playlist_type = form_data.get('playlist_type')
            playlist_uri = form_data.get('playlist_uri')
            playlist_tracks = form_data.get('playlist_tracks')

            # Get Spotify playlist tracks
            endpoint = 'v1/playlists/'+playlist_id+"/tracks"
            response = execute_spotify_api_request(user, endpoint)

            # Check if tracks are successfully retrieved
            if "items" not in response:
                return JsonResponse({'error': 'Failed to retrieve playlist tracks from the Spotify API.'}, status=500)

            # # Initialize an empty list for the tracks
            tracks = []

            # # Loop through the items in the playlist
            for item in response["items"]:

                #     # Initialize an empty dictionary for the current track
                track = {}

                # Extract data from spotify api playlist
                track["artist"] = item["track"]["artists"][0]["name"]
                track["album"] = item["track"]["album"]["name"]
                track["name"] = item["track"]["name"]
                track["track_id"] = item["track"]["external_urls"]['spotify']
                track["uri"] = item["track"]["uri"]
                track["images"] = item["track"]["album"]["images"][2]['url']

                # Add the current track to the list of tracks
                tracks.append(track)

            # Save playlist to database
            playlist = Playlist.objects.create(
                user=user, description=description, playlist_url=playlist_url,
                playlist_ApiURL=playlist_ApiURL, playlist_id=playlist_id,
                playlist_cover=playlist_cover, playlist_title=playlist_title,
                playlist_type=playlist_type, playlist_uri=playlist_uri, playlist_tracks=playlist_tracks)
            playlist.save()
            PlaylistSerializer(playlist)

            # Save tracks in db
            for track in tracks:
                playlist_track = PlaylistTracks.objects.create(
                    playlist=playlist, artist=track['artist'], album=track['album'],
                    name=track['name'], track_id=track['track_id'], uri=track['uri'], images=track['images']
                )
                playlist_track.save()
                PlaylistTracksSerializer(playlist_track)

            # Iterate images
            for image in images:
                client = storage.Client.from_service_account_json(
                    settings.GCS_CREDENTIALS)
                bucket = client.bucket(os.environ.get('GS_BUCKET_NAME'))
                blob = bucket.blob(f"media/playlist_images/{image.name}")
                blob.upload_from_file(image)

                # Save images to db
                playlist_image = PlaylistImages.objects.create(
                    playlist=playlist, image=image.name)
                playlist_image.save()
                PlaylistImagesSerializer(playlist_image)
            return Response(status=status.HTTP_201_CREATED)
        except:
            return JsonResponse(status=500)

    def delete(self, request, format=None):
        playlist_id = request.GET.get('id')
        playlist = Playlist.objects.get(id=playlist_id)
        credentials = service_account.Credentials.from_service_account_file(
            settings.GCS_CREDENTIALS
        )
        try:
            images = PlaylistImages.objects.filter(playlist=playlist)
            # print(images)
            for i in images:
                # Get the image URL from Google Cloud Storage
                client = storage.Client(credentials=credentials)
                bucket = client.bucket(os.environ.get('GS_BUCKET_NAME'))
                image = bucket.blob(f"media/playlist_images/{i.image}")
                image.delete()

            playlist = Playlist.objects.get(id=playlist_id).delete()

            return Response(status=status.HTTP_200_OK)
        except:
            return JsonResponse({'error': 'An unexpected error occurred.'}, status=500)


# GET PLAYLIST FROM USERS I'M FOLLOWING + MINE
class FollowingPlaylists(generics.ListAPIView):
    serializer_class = FollowingPlaylistSerializer

    def get_queryset(self):
        try:
            user = self.request.user
            following = Follow.objects.filter(
                user_id=user).values('following_user_id')
            playlists = Playlist.objects.filter(
                user_id__in=following) | Playlist.objects.filter(user_id=user)
            if len(playlists) > 0:
                return playlists.order_by('-date')
            else:
                return Playlist.objects.none()
        except:
            return JsonResponse({'error': 'An unexpected error occurred.'}, status=500)


# LIKE // UNLIKE // GET LIKE
class LikesViewSet(APIView):
    serializer_class = LikesSerializer

    # CHECKS IF CURRENT USER LIKES PLAYLIST
    def get(self, request):
        user = self.request.user
        playlist_id = request.GET.get('id')
        isLiked = Like.objects.filter(
            user=user).filter(playlist_id=playlist_id).values('like')

        if isLiked.exists():
            return Response(True, status=status.HTTP_200_OK)

        return Response(False, status=status.HTTP_200_OK)

    # LETS CURRENT USER LIKE PLAYLIST
    def post(self, request):
        try:
            user = self.request.user
            playlist = request.data.get('id')
            playlist = Playlist.objects.get(id=playlist)
            like = request.data.get('like')

            like = Like.objects.create(
                user=user, playlist=playlist, like=like)

            like.save()

            serializer = LikesSerializer(like)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except:
            return JsonResponse({'error': 'An unexpected error occurred.'}, status=500)

    # LETS CURRENT USER UNLIKE PLAYLIST
    def delete(self, request, format=None):
        try:
            playlist_id = request.GET.get('id')
            user = self.request.user

            Like.objects.filter(user=user).filter(
                playlist=playlist_id).delete()

            return Response(False, status=status.HTTP_200_OK)
        except:
            return JsonResponse({'error': 'An unexpected error occurred.'}, status=500)


# POST // DELETE // GET COMMENTS
class CommentView(APIView):
    serializer_class = CommentSerializer

    # LETS CURRENT USER POST COMMENT
    def post(self, request):
        try:
            user = self.request.user
            playlist_id = request.data.get('id')
            title = request.data.get('title')
            playlist = Playlist.objects.get(id=playlist_id)

            comment = Comment.objects.create(
                user=user, playlist=playlist, title=title)
            comment.save()
            serializer = CommentSerializer(comment)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except:
            return JsonResponse(status=500)

    # LETS USER DELETE SPECIFIC COMMENT
    def delete(self, request):
        try:
            comment_id = request.GET.get('id')
            Comment.objects.filter(id=comment_id).delete()
            return Response(status=status.HTTP_200_OK)
        except:
            return JsonResponse({'error': 'An unexpected error occurred.'}, status=500)

    # GETS ALL COMMENTS FOR CURRENT PLAYLIST
    def get(self, request):
        try:
            playlist_id = request.query_params.get('id')
            playlist = Playlist.objects.get(id=playlist_id)
            comment = Comment.objects.filter(playlist=playlist)
            serializer = CommentSerializer(comment, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return JsonResponse({'error': 'An unexpected error occurred.'})


class SearchView(generics.ListAPIView):
    serializer_class = CombinedSearchSerializer

    def get_queryset(self):
        queryset_users = User.objects.filter(
            Q(name__icontains=self.request.query_params.get('q', '')) |
            Q(username__icontains=self.request.query_params.get('q', '')))

        queryset_playlists = Playlist.objects.filter(
            Q(playlist_title__icontains=self.request.query_params.get('q', '')))

        if queryset_users.exists() and queryset_playlists.exists():
            return [queryset_users, queryset_playlists]
        elif queryset_users.exists():
            return queryset_users
        elif queryset_playlists.exists():
            return queryset_playlists
        else:
            return None
