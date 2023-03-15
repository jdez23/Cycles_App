from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(SpotifyToken)
admin.site.register(SpotifyPlaylistTracksModel)
admin.site.register(SpotifyPlaylistModel)
