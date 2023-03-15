from django.db import models
from users.models import User

# Create your models here.

class notifications(models.Model):

    NOTIFICATION_TYPES = ((1, 'Like'), (2, 'Comment'), (3, 'Follow'))

    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, blank=True, null=True, related_name='from_user')
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, blank=True, null=True, related_name='to_user')
    notification_type = models.IntegerField(NOTIFICATION_TYPES)
    date = models.DateTimeField(auto_now_add=True)
