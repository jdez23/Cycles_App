# Generated by Django 4.1.6 on 2023-04-19 03:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feed', '0018_alter_playlistimages_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='playlistimages',
            name='image',
            field=models.CharField(blank=True, default='', max_length=300, null=True),
        ),
    ]
