# Generated by Django 4.1.6 on 2023-02-19 18:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('spotify_api', '0003_spotifytoken_spotify_username'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='spotifyplaylisttracksmodel',
            name='playlist',
        ),
        migrations.DeleteModel(
            name='SpotifyPlaylistModel',
        ),
        migrations.DeleteModel(
            name='SpotifyPlaylistTracksModel',
        ),
    ]