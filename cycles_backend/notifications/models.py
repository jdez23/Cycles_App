from django.utils import timezone
from django.db import models
from users.models import User, Follow
from feed.models import Comment, Like

# Create your models here.


class fcmToken(models.Model):

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, blank=True, null=True)
    token = models.CharField(max_length=300)
    date = models.DateTimeField(editable=False, default=timezone.now)


class Notification(models.Model):
    to_user = models.ForeignKey(
        User, on_delete=models.CASCADE, blank=True, null=True, related_name='to_user')
    from_user = models.ForeignKey(
        User, on_delete=models.CASCADE, blank=True, null=True, related_name='from_user')
    title = models.CharField(max_length=100, default=None, blank=True)
    image = models.ImageField(default=None, null=True,
                              blank=True, upload_to='media/notif_images')
    body = models.TextField(default=None, blank=True)
    playlist_id = models.TextField(default='', null=True, blank=True)
    follow = models.ForeignKey(
        Follow, blank=True, null=True, on_delete=models.CASCADE, default='')
    like = models.ForeignKey(
        Like, blank=True, null=True, on_delete=models.CASCADE, default='')
    comment = models.ForeignKey(
        Comment, blank=True, null=True, on_delete=models.CASCADE, default='')
    date = models.DateTimeField(editable=False, default=timezone.now)
    type = models.CharField(max_length=15, default=None,
                            null=False, blank=False)
