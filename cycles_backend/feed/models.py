from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

from users.models import User

# Create your models here.


def playlistCoverFile(instance, filename):
    return 'media/playlist_images/{filename}'.format(filename=filename)


class Playlist(models.Model):
    user_id = models.ForeignKey(
        User, on_delete=models.CASCADE, default=None
    )
    image = models.ImageField(
        _('Image'), upload_to=playlistCoverFile, blank=True)
    description = models.TextField(null=False, default=None)
    playlist_url = models.CharField(max_length=300, default=None)
    playlist_ApiURL = models.CharField(max_length=300, default=None)
    playlist_id = models.CharField(max_length=300, default=None)
    playlist_cover = models.CharField(max_length=300, default=None)
    playlist_title = models.CharField(max_length=300, default=None)
    playlist_type = models.CharField(max_length=300, default=None)
    playlist_uri = models.CharField(max_length=300, default=None)
    playlist_tracks = models.CharField(max_length=300, default=None)
    date = models.DateField(auto_now=True)
    #hashtags = models.CharField(max_length=250, blank=True)
    #comments_off = models.BooleanField(default=False)


class Like(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    playlist = models.ForeignKey(
        Playlist, on_delete=models.CASCADE, null=True, blank=True)
    like = models.BooleanField(default=False)

    def __str__(self):
        return f"User={self.user.username}||Like={self.like}"


class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    playlist = models.ForeignKey(
        Playlist, on_delete=models.CASCADE, null=True, blank=True)
    title = models.TextField()
    date = models.DateField(auto_now=True)

    def __str__(self):
        return self.title


class Reply(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    title = models.TextField()
    date = models.DateField(auto_now=True)

    def __str__(self):
        return f"User={self.user.username}||Comment={self.comment}"
