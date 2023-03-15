# Generated by Django 3.2.3 on 2022-06-04 17:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feed', '0009_auto_20220604_1027'),
    ]

    operations = [
        migrations.AlterField(
            model_name='playlist',
            name='playlist_ApiURL',
            field=models.CharField(default=None, max_length=300),
        ),
        migrations.AlterField(
            model_name='playlist',
            name='playlist_cover',
            field=models.CharField(default=None, max_length=300),
        ),
        migrations.AlterField(
            model_name='playlist',
            name='playlist_id',
            field=models.CharField(default=None, max_length=300),
        ),
        migrations.AlterField(
            model_name='playlist',
            name='playlist_title',
            field=models.CharField(default=None, max_length=300),
        ),
        migrations.AlterField(
            model_name='playlist',
            name='playlist_tracks',
            field=models.CharField(default=None, max_length=300),
        ),
        migrations.AlterField(
            model_name='playlist',
            name='playlist_type',
            field=models.CharField(default=None, max_length=300),
        ),
        migrations.AlterField(
            model_name='playlist',
            name='playlist_uri',
            field=models.CharField(default=None, max_length=300),
        ),
        migrations.AlterField(
            model_name='playlist',
            name='playlist_url',
            field=models.CharField(default=None, max_length=300),
        ),
    ]
