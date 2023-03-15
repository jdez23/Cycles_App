from .models import *
from rest_framework import serializers


class SpotifyTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpotifyToken
        fields = "__all__"
