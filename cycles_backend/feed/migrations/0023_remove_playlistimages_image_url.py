# Generated by Django 4.1.6 on 2023-04-21 03:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('feed', '0022_alter_playlistimages_image_url'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='playlistimages',
            name='image_url',
        ),
    ]
