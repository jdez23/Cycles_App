from django.conf import settings
from django.db import models

# Create your models here.


class SpotifyToken(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    spotify_username = models.CharField(max_length=300, default='')
    access_token = models.CharField(max_length=300)
    refresh_token = models.CharField(max_length=300)
    expires_in = models.DateTimeField(max_length=300)
    token_type = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)
