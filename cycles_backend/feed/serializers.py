import os
from .models import *
from django.db.models import Q
from users.serializers import SearchUserSerializer
from rest_framework import serializers
from google.oauth2 import service_account
from google.cloud import storage


class CombinedSearchSerializer(serializers.Serializer):
    users = serializers.SerializerMethodField()
    playlists = serializers.SerializerMethodField()

    def get_users(self, obj):
        queryset_users = User.objects.filter(
            Q(name__icontains=self.context['request'].query_params.get('q', '')) |
            Q(username__icontains=self.context['request'].query_params.get('q', '')))
        return SearchUserSerializer(queryset_users, many=True).data

    def get_playlists(self, obj):
        queryset_playlists = Playlist.objects.filter(
            Q(playlist_title__icontains=self.context['request'].query_params.get('q', '')))
        return SearchPlaylistSerializer(queryset_playlists, many=True).data


class SearchPlaylistSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')

    class Meta:
        model = Playlist
        fields = ('id', 'playlist_title', 'user',
                  'playlist_cover', 'username', 'playlist_type')


class UserPlaylistSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField('get_username_from_user')
    avi_pic = serializers.SerializerMethodField('get_avi_pic')

    class Meta:
        model = Playlist
        fields = "__all__"

    def get_username_from_user(self, playlist):
        username = playlist.user.username
        return username

    def get_avi_pic(self, playlist):
        avi_pic = playlist.user.avi_pic
        credentials = service_account.Credentials.from_service_account_file(
            settings.GCS_CREDENTIALS)
        # Get the image URL from Google Cloud Storage
        client = storage.Client(credentials=credentials)
        bucket = client.bucket(os.environ.get('GS_BUCKET_NAME'))
        blob = bucket.blob(f"media/avi_images/{avi_pic}")
        url = blob.public_url

        return url


class PlaylistDetailSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField('get_username_from_user')
    images = serializers.SerializerMethodField('get_images')

    class Meta:
        model = Playlist
        fields = "__all__"

    def get_username_from_user(self, playlist):
        username = playlist.user.username
        return username

    def get_images(self, playlist):
        playlist = Playlist.objects.get(id=playlist.id)
        images = PlaylistImages.objects.filter(
            playlist=playlist)
        if images:
            return GetPlaylistImagesSerializer(images, many=True).data
        else:
            return None


class PlaylistTracksSerializer(serializers.ModelSerializer):

    class Meta:
        model = PlaylistTracks
        fields = "__all__"


class PlaylistImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaylistImages
        fields = "__all__"


class GetPlaylistImagesSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField('get_image')

    class Meta:
        model = PlaylistImages
        fields = "__all__"

    def get_image(self, data):
        credentials = service_account.Credentials.from_service_account_file(
            settings.GCS_CREDENTIALS
        )
        # Get the image URL from Google Cloud Storage
        client = storage.Client(credentials=credentials)
        bucket = client.bucket(os.environ.get('GS_BUCKET_NAME'))
        blob = bucket.blob(f"media/playlist_images/{data.image}")
        url = blob.public_url

        return url


class FollowingPlaylistSerializer(serializers.ModelSerializer):

    username = serializers.SerializerMethodField('get_username_from_user')
    location = serializers.SerializerMethodField('get_location_from_user')
    avi_pic = serializers.SerializerMethodField('get_avi_pic')
    first_image = serializers.SerializerMethodField('get_first_image')

    class Meta:
        model = Playlist
        fields = "__all__"

    def get_username_from_user(self, playlist):
        username = playlist.user.username
        return username

    def get_location_from_user(self, playlist):
        location = playlist.user.location
        return location

    def get_avi_pic(self, playlist):
        avi_pic = playlist.user.avi_pic
        credentials = service_account.Credentials.from_service_account_file(
            settings.GCS_CREDENTIALS
        )
        # Get the image URL from Google Cloud Storage
        client = storage.Client(credentials=credentials)
        bucket = client.bucket(os.environ.get('GS_BUCKET_NAME'))
        blob = bucket.blob(f"media/avi_images/{avi_pic}")
        url = blob.public_url

        return url

    def get_first_image(self, playlist):
        try:
            first_image = PlaylistImages.objects.filter(
                playlist=playlist).first()
            if first_image:
                return GetPlaylistImagesSerializer(first_image).data
            else:
                return None
        except PlaylistImages.DoesNotExist:
            return None


class PlaylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playlist
        fields = "__all__"


class CommentSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField('get_username_from_user')
    avi_pic = serializers.SerializerMethodField('get_avi_pic')

    class Meta:
        model = Comment
        fields = '__all__'

    def get_username_from_user(self, comment):
        username = comment.user.username
        return username

    def get_avi_pic(self, comment):
        avi_pic = comment.user.avi_pic
        credentials = service_account.Credentials.from_service_account_file(
            settings.GCS_CREDENTIALS
        )
        # Get the image URL from Google Cloud Storage
        client = storage.Client(credentials=credentials)
        bucket = client.bucket(os.environ.get('GS_BUCKET_NAME'))
        blob = bucket.blob(f"media/avi_images/{avi_pic}")
        url = blob.public_url

        return url


class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = "__all__"


class LikesSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField('get_username_from_user')
    avi_pic = serializers.SerializerMethodField('get_avi_pic')

    class Meta:
        model = Like
        fields = "__all__"

    def get_username_from_user(self, like):
        username = like.user.username
        return username

    def get_avi_pic(self, like):
        avi_pic = like.user.avi_pic
        credentials = service_account.Credentials.from_service_account_file(
            settings.GCS_CREDENTIALS
        )
        # Get the image URL from Google Cloud Storage
        client = storage.Client(credentials=credentials)
        bucket = client.bucket(os.environ.get('GS_BUCKET_NAME'))
        blob = bucket.blob(f"media/avi_images/{avi_pic}")
        url = blob.public_url

        return url
