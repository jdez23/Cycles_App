# Generated by Django 4.1.6 on 2023-04-22 01:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feed', '0024_playlistimages_image_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='playlistimages',
            name='image_url',
            field=models.ImageField(blank=True, default=None, max_length=3000, null=True, upload_to='playlist_images/'),
        ),
    ]