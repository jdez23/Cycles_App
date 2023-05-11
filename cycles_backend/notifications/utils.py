from .models import fcmToken


def get_fcm_token(user):
    try:
        user_token = fcmToken.objects.get(user=user)
        return user_token
    except fcmToken.DoesNotExist:
        return None


def get_update_or_create_fcm_token(user, token):
    fcm_token = get_fcm_token(user)

    if fcm_token:
        if token == fcm_token.token:
            return fcm_token
        else:
            fcm_token.token = token
            fcm_token.save(update_fields=['token'])
            return fcm_token
    else:
        firebase_token = fcmToken(user=user, token=token)
        firebase_token.save()
        return firebase_token
