# Generated by Django 4.1.6 on 2023-04-19 03:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0011_alter_user_avi_pic_alter_user_header_pic'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='avi_pic',
            field=models.CharField(blank=True, default='', max_length=3000, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='header_pic',
            field=models.CharField(blank=True, default='', max_length=3000, null=True),
        ),
    ]
