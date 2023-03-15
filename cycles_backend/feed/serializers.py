from .models import *
from rest_framework import serializers


class PlaylistSerializer(serializers.ModelSerializer):

    username = serializers.SerializerMethodField('get_username_from_user')
    avi_pic = serializers.SerializerMethodField('get_avi_pic')

    class Meta:
        model = Playlist
        fields = "__all__"

    def get_username_from_user(self, playlist):
        username = playlist.user_id.username
        return username

    def get_avi_pic(self, playlist):
        request = self.context.get('request')
        avi_pic = playlist.user_id.avi_pic.url
        return request.build_absolute_uri(avi_pic)


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"


class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = "__all__"


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = "__all__"
