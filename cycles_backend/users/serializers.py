from .models import *
import os
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from google.oauth2 import service_account
from google.cloud import storage
from django.core.exceptions import ImproperlyConfigured


class TokenSerializer(serializers.ModelSerializer):

    class Meta:
        model = Token
        fields = ('key', 'user')


class SearchUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'username', 'avi_pic')


class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('firebase_id', 'id', 'username')


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('firebase_id', 'id', 'username')


class UserSerializer(serializers.ModelSerializer):

    following = serializers.SerializerMethodField('get_following')
    followers = serializers.SerializerMethodField('get_follower')
    header_pic = serializers.SerializerMethodField('get_header_pic_url')
    avi_pic = serializers.SerializerMethodField('get_avi_pic_url')

    class Meta:
        model = User
        fields = ['id', 'header_pic', 'avi_pic', 'email',
                  'name', 'username', 'location',
                  'bio', 'spotify_url', 'following', 'followers']

    def create(self, validated_data):
        Token.objects.create(user=user)
        return user

    def get_following(self, obj):
        return FollowSerializer(obj.follower.all(), many=True).data

    def get_follower(self, obj):
        return FollowSerializer(obj.following.all(), many=True).data

    def get_storage_client(self):
        try:
            return storage.Client.from_service_account_json(settings.GOOGLE_APPLICATION_CREDENTIALS)
        except Exception as e:
            raise ImproperlyConfigured(
                "Error loading Google Cloud Storage client: {}".format(e)
            )

    def get_header_pic_url(self, obj):
        if obj.header_pic:
            client = self.get_storage_client()
            bucket = client.bucket(settings.GS_BUCKET_NAME)
            blob = bucket.blob(str(obj.header_pic))
            return blob.public_url
        else:
            return None

    def get_avi_pic_url(self, obj):
        if obj.avi_pic:
            client = self.get_storage_client()
            bucket = client.bucket(settings.GS_BUCKET_NAME)
            blob = bucket.blob(str(obj.avi_pic))
            return blob.public_url
        else:
            return None


class FollowSerializer(serializers.ModelSerializer):
    # avi_pic = serializers.SerializerMethodField('get_avi_pic')
    # username = serializers.SerializerMethodField('get_username')

    class Meta:
        model = Follow
        fields = '__all__'

    # def get_username_from_user(self, follow):
    #     username = follow.user.username
    #     return username

    # def get_avi_pic(self, follow):
    #     # request = self.context['request']
    #     avi_pic = follow.user.avi_pic.url
    #     return avi_pic


class FollowingSerializer(serializers.ModelSerializer):
    # avi_pic = serializers.SerializerMethodField('get_avi_pic')
    username = serializers.SerializerMethodField('get_username')
    name = serializers.SerializerMethodField('get_name')

    # def get_avi_pic(self, obj):
    #     avi_pic = obj.following_user.avi_pic.url
    #     return avi_pic

    def get_username(self, obj):
        username = obj.following_user.username
        return username

    def get_name(self, obj):
        name = obj.following_user.name
        return name

    class Meta:
        model = Follow
        fields = "__all__"


class FollowerSerializer(serializers.ModelSerializer):
    # avi_pic = serializers.SerializerMethodField('get_avi_pic')
    username = serializers.SerializerMethodField('get_username')
    name = serializers.SerializerMethodField('get_name')

    class Meta:
        model = Follow
        fields = "__all__"

    # def get_avi_pic(self, obj):
    #     avi_pic = obj['user_id'].avi_pic.url
    #     return avi_pic

    def get_username(self, obj):
        username = obj.user.username
        return username

    def get_name(self, obj):
        name = obj.user.name
        return name


class SubscriptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Subscription
        fields = '__all__'
