from django.utils import timezone
from datetime import timedelta
from .credentials import *
from requests import post, get
from .models import SpotifyToken

BASE_URL = "https://api.spotify.com/"


def get_user_tokens(user):
    user_tokens = SpotifyToken.objects.filter(user=user)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None


def update_or_create_user_tokens(user, spotify_username, access_token, refresh_token, expires_in, token_type):
    tokens = get_user_tokens(user)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token',
                                   'refresh_token', 'expires_in', 'token_type'])
    else:
        tokens = SpotifyToken(user=user, spotify_username=spotify_username, access_token=access_token,
                              refresh_token=refresh_token, expires_in=expires_in, token_type=token_type)
        tokens.save()


def update_user_token(user, access_token, refresh_token, expires_in):
    tokens = get_user_tokens(user)
    if not tokens:
        return
    tokens.token = access_token
    tokens.refresh_token = refresh_token
    tokens.expires_in = timezone.now() + timedelta(seconds=expires_in)
    tokens.save(update_fields=['token', 'token_secret', 'expires_at'])


def is_spotify_authenticated(user):
    tokens = get_user_tokens(user)
    if tokens:
        expiry = tokens.expires_in
        try:
            if expiry <= timezone.now():
                refresh_spotify_token(user)
            return True
        except:
            False
    return False


def refresh_spotify_token(user):
    refresh_token = get_user_tokens(user).refresh_token
    spotify_username = get_user_tokens(user).spotify_username

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    }).json()

    access_token = response.get('access_token')
    expires_in = response.get('expires_in')
    token_type = response.get('token_type')

    update_or_create_user_tokens(
        user, spotify_username, access_token, refresh_token, expires_in, token_type)


def execute_spotify_api_request(user, endpoint, post_=False):
    access_token = get_user_tokens(user).access_token
    headers = {'Authorization': "Bearer " + access_token}

    if post_:
        response = post(BASE_URL + endpoint, headers=headers)
    else:
        response = get(BASE_URL + endpoint, {}, headers=headers)

    try:
        return response.json()
    except:
        return {'Error': 'Issue with request'}
