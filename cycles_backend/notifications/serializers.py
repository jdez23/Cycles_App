from .models import *
from rest_framework import serializers


class fcmTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = fcmToken
        fields = "__all__"


class NotificationSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField('get_username_from_user')
    avi_pic = serializers.SerializerMethodField('get_avi_pic')

    class Meta:
        model = Notification
        fields = "__all__"

    def get_username_from_user(self, notification):
        username = notification.from_user.username
        return username

    def get_avi_pic(self, notification):
        avi_pic = notification.to_user.avi_pic.url
        return avi_pic
