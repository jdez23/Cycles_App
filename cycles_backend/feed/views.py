from rest_framework import authentication, viewsets, permissions, status, generics

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .serializers import *
from .models import *

from users.models import Follow

# Create your views here.


# POST PLAYLIST
# GET ALL PLAYLISTS
class PlaylistViewSet(viewsets.ModelViewSet):
    authentication_class = [authentication.TokenAuthentication]
    permission_class = [permissions.IsAuthenticated]
    serializer_class = PlaylistSerializer
    parser_classes = [MultiPartParser, FormParser]
    queryset = Playlist.objects.all()

    def post(self, request, format=None):
        user_id = self.request.user
        image = request.data.get('image')
        description = request.data.get('description')
        playlist_url = request.data.get('playlist_url')
        playlist_ApiURL = request.data.get('playlist_ApiURL')
        playlist_id = request.data.get('playlist_id')
        playlist_cover = request.data.get('playlist_cover')
        playlist_title = request.data.get('playlist_title')
        playlist_type = request.data.get('playlist_type')
        playlist_uri = request.data.get('playlist_uri')
        playlist_tracks = request.data.get('playlist_tracks')

        playlist = Playlist.objects.create(
            user_id=user_id, image=image, description=description,
            playlist_url=playlist_url, playlist_ApiURL=playlist_ApiURL, playlist_id=playlist_id,
            playlist_cover=playlist_cover, playlist_title=playlist_title,
            playlist_type=playlist_type, playlist_uri=playlist_uri, playlist_tracks=playlist_tracks)

        playlist.save()

        serializer = PlaylistSerializer(playlist)

        return Response(serializer.data, status=status.HTTP_200_OK)


# CRUD
# GET MY PLAYLISTS
class MyPlaylists(generics.ListAPIView):
    authentication_class = [authentication.TokenAuthentication]
    permission_class = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = PlaylistSerializer

    def get_queryset(self):
        user = self.request.user
        return Playlist.objects.filter(user_id=user)

    """ def get(self, request):
        query = Playlist.objects.all()
        serializer = PlaylistSerializer(query, many=True)
        data = []
        for playlist in serializer.data:
            playlist_like = Like.objects.filter(
                playlist=playlist['id']).filter(like=True).count()
            mylike = Like.objects.filter(playlist=playlist['id']).filter(
                user=request.user).first()
            if mylike:
                playlist['like'] = mylike.like
            else:
                playlist['like'] = False
            playlist['totallike'] = playlist_like
            comment_query = Comment.objects.filter(playlist=playlist['id'])
            comment_serializer = CommentSerializer(
                comment_query, many=True)
            comment_data = []
            for comment in comment_serializer.data:
                reply_query = Reply.objects.filter(comment=comment['id'])
                reply_serializer = ReplySerializer(reply_query, many=True)
                comment['reply'] = reply_serializer.data
                comment_data.append(comment)
            playlist['comment'] = comment_serializer.data
            data.append(playlist)
        return Response(data) """


# GET PLAYLIST FROM USERS I'M FOLLOWING + MINE
# class FollowingPlaylists(APIView):
#     authentication_class = [authentication.TokenAuthentication]
#     permission_class = [permissions.IsAuthenticated]
#     queryset = Playlist.objects.filter(
#         user_id__following__following=Following.following_user_id)
