from django.conf import settings
from django.db import models

# Create your models here.


class SpotifyToken(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    access_token = models.CharField(max_length=300)
    refresh_token = models.CharField(max_length=300)
    expires_in = models.DateTimeField(max_length=300)
    token_type = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)


class SpotifyPlaylistModel(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    cover = models.ImageField(
        upload_to="spotify_playlist_cover/", blank=True)
    playlist_id = models.CharField(max_length=200)
    url = models.URLField()
    type = models.CharField(max_length=200, default='TYPE')
    songs = models.ForeignKey(
        'SpotifyPlaylistTracksModel', on_delete=models.CASCADE)


class SpotifyPlaylistTracksModel(models.Model):
    playlist = models.ForeignKey(
        SpotifyPlaylistModel, on_delete=models.CASCADE, null=False)
    title = models.CharField(max_length=300)
    cover = models.ImageField(upload_to='spotify_playlist_tracks_cover')
    artist = models.CharField(max_length=200)
    track_id = models.CharField(max_length=200)
    uri = models.URLField()
