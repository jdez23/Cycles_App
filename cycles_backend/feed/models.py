import os
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.contrib.postgres.fields import ArrayField

from users.models import User

# Create your models here.

class Playlist(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, default=None
    )
    description = models.TextField(null=False, default=None)
    playlist_url = models.CharField(max_length=300, default='', blank=True)
    playlist_ApiURL = models.CharField(
        max_length=300, default=None, blank=True)
    playlist_id = models.CharField(max_length=300, default='', blank=True)
    playlist_cover = models.CharField(max_length=300, default='', blank=True)
    playlist_title = models.CharField(max_length=300, default='', blank=True)
    playlist_type = models.CharField(max_length=300, default='', blank=True)
    playlist_uri = models.CharField(max_length=300, default='', blank=True)
    playlist_tracks = models.CharField(
        max_length=300, default=None, blank=True)
    date = models.DateTimeField(editable=False, auto_now_add=True)


class PlaylistTracks(models.Model):
    playlist = models.ForeignKey(
        Playlist, on_delete=models.CASCADE)
    name = models.CharField(max_length=300, default='')
    artist = models.CharField(max_length=300, default='')
    album = models.CharField(max_length=300, default='')
    track_id = models.CharField(max_length=300, default='')
    uri = models.CharField(max_length=300, default='')
    images = models.CharField(max_length=700, default='')


class PlaylistImages(models.Model):
    playlist = models.ForeignKey(
        Playlist, on_delete=models.CASCADE, related_name='playlist_images')
    image = models.CharField(default='', null=True,
                             blank=True, max_length=3000)


class Like(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    playlist = models.ForeignKey(
        Playlist, on_delete=models.CASCADE, default=False, blank=False)
    like = models.BooleanField(default=False)
    date = models.DateTimeField(editable=False, auto_now_add=True)

    def __str__(self):
        return f"User={self.user.username}||Liked || Playlist={self.playlist}"


class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    playlist = models.ForeignKey(
        Playlist, on_delete=models.CASCADE, null=False, blank=False, default=None)
    title = models.TextField()
    date = models.DateTimeField(editable=False, auto_now_add=True)

    def __str__(self):
        return f"User={self.user.username}||Title={self.title} || Playlist={self.playlist}"


class Reply(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    title = models.TextField()
    date = models.DateTimeField(editable=False, auto_now_add=True)

    def __str__(self):
        return f"User={self.user.username}||Comment={self.comment}"
