# Generated by Django 3.2.3 on 2022-12-30 20:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0004_auto_20221229_1642'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='image',
            field=models.ImageField(blank=True, default=None, max_length=300, null=True, upload_to=''),
        ),
    ]