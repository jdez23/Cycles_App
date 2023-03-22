# Generated by Django 3.2.3 on 2023-01-07 23:55

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feed', '0006_rename_user_id_playlist_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='playlist',
            name='images',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.ImageField(blank=True, default=None, null=True, upload_to='media/playlist_images'), default=None, size=None),
        ),
        migrations.AlterField(
            model_name='playlist',
            name='playlist_cover',
            field=models.CharField(blank=True, default='', max_length=300),
        ),
        migrations.AlterField(
            model_name='playlist',
            name='playlist_id',
            field=models.CharField(blank=True, default='', max_length=300),
        ),
        migrations.AlterField(
            model_name='playlist',
            name='playlist_title',
            field=models.CharField(blank=True, default='', max_length=300),
        ),
        migrations.AlterField(
            model_name='playlist',
            name='playlist_type',
            field=models.CharField(blank=True, default='', max_length=300),
        ),
        migrations.AlterField(
            model_name='playlist',
            name='playlist_uri',
            field=models.CharField(blank=True, default='', max_length=300),
        ),
        migrations.AlterField(
            model_name='playlist',
            name='playlist_url',
            field=models.CharField(blank=True, default='', max_length=300),
        ),
    ]