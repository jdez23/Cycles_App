import os
from .models import *
from rest_framework import serializers
from google.oauth2 import service_account
from google.cloud import storage
from django.conf import settings


class fcmTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = fcmToken
        fields = "__all__"


class NotificationSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField('get_username_from_user')
    avi_pic = serializers.SerializerMethodField('get_avi_pic')
    image = serializers.SerializerMethodField('get_image')

    class Meta:
        model = Notification
        fields = "__all__"

    def get_username_from_user(self, notification):
        username = notification.from_user.username
        return username

    def get_avi_pic(self, notification):
        avi_pic = notification.to_user.avi_pic
        credentials = service_account.Credentials.from_service_account_file(
            settings.GCS_CREDENTIALS)
        # Get the image URL from Google Cloud Storage
        client = storage.Client(credentials=credentials)
        bucket = client.bucket(os.environ.get('GS_BUCKET_NAME'))
        blob = bucket.blob(f"media/avi_images/{avi_pic}")
        url = blob.public_url

        return url

    def get_image(self, notif):
        try:
            credentials = service_account.Credentials.from_service_account_file(
                settings.GCS_CREDENTIALS
            )
            # Get the image URL from Google Cloud Storage
            client = storage.Client(credentials=credentials)
            bucket = client.bucket(os.environ.get('GS_BUCKET_NAME'))
            blob = bucket.blob(f"media/playlist_images/{notif.image}")
            url = blob.public_url

            return url
        except:
            return None
