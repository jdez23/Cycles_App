# Generated by Django 3.2.3 on 2023-01-11 05:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_auto_20221230_1242'),
        ('feed', '0016_auto_20230107_2059'),
        ('notifications', '0007_alter_notification_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='comment',
            field=models.ForeignKey(blank=True, default='', null=True, on_delete=django.db.models.deletion.CASCADE, to='feed.comment'),
        ),
        migrations.AlterField(
            model_name='notification',
            name='follow',
            field=models.ForeignKey(blank=True, default='', null=True, on_delete=django.db.models.deletion.CASCADE, to='users.follow'),
        ),
        migrations.AlterField(
            model_name='notification',
            name='like',
            field=models.ForeignKey(blank=True, default='', null=True, on_delete=django.db.models.deletion.CASCADE, to='feed.like'),
        ),
    ]