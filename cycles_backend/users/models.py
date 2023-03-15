from django.db import models
from django.db.models.fields import CharField
from django.db.models.signals import post_save

from django.contrib.gis.db import models
from django.contrib.auth.models import AbstractUser

from django.conf import settings

from django.dispatch import receiver

from django.utils.translation import gettext_lazy as _

from .managers import UserManager

from rest_framework.authtoken.models import Token


user = settings.AUTH_USER_MODEL


def aviFile(instance, filename):
    return 'avi_images/{filename}'.format(filename=filename)


def headerFile(instance, filename):
    return 'header_images/{filename}'.format(filename=filename)


class User(AbstractUser):
    objects = UserManager()

    username = models.CharField(max_length=60, unique=True)
    email = models.EmailField(max_length=250, unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    is_private = models.BooleanField(default=False, null=True)
    bio = models.CharField(max_length=200, null=True, blank=True)
    location = CharField(max_length=80, null=True, blank=True)
    header_pic = models.ImageField(
        _('Image'), upload_to=headerFile, null=True, blank=True)
    avi_pic = models.ImageField(
        _('Image'), upload_to=aviFile, null=True, blank=True)
    spotify_url = models.URLField(null=True, blank=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def create_auth_token(sender, instance=None, created=False, **kwargs):
        if created:
            Token.objects.create(user=instance)


class Follow(models.Model):
    user_id = models.ForeignKey(
        "User", related_name="follower", on_delete=models.CASCADE)
    following_user_id = models.ForeignKey(
        "User", related_name="following", blank=True, on_delete=models.CASCADE)
    date_followed = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user_id', 'following_user_id'],  name="unique_followers")
        ]

        ordering = ["-date_followed"]

    def __str__(self):
        return f"{self.user_id.username} follows {self.following_user_id.username}"
