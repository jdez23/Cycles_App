from dataclasses import fields
from .models import *

from rest_framework import serializers
from rest_auth.registration.serializers import RegisterSerializer
from rest_framework.authtoken.models import Token


class RegistrationSerializer(RegisterSerializer):

    def custom_signup(self, request, user):
        user.save()


class UserSerializer(serializers.ModelSerializer):

    following = serializers.SerializerMethodField('get_following')
    followers = serializers.SerializerMethodField('get_follower')

    class Meta:
        model = User
        fields = "__all__"
        write_only_fields = ('password')

    def create(self, validated_data):
        Token.objects.create(user=user)
        return user

    def get_following(self, obj):
        return FollowingSerializer(obj.following.all(), many=True).data

    def get_follower(self, obj):
        return FollowerSerializer(obj.follower.all(), many=True).data


class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = '__all__'


class FollowingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Follow
        fields = ("id", "following_user_id", "date_followed")


class FollowerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Follow
        fields = ("id", "user_id", "date_followed")
