# Generated by Django 4.2.14 on 2024-08-25 10:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0003_alter_user_password'),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bio', models.TextField(blank=True, default='')),
                ('exp', models.IntegerField(default=0)),
                ('avatar', models.CharField(default='')),
                ('image', models.CharField(default='', unique=True)),
                ('online', models.BooleanField(default=False)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='login.user')),
            ],
        ),
    ]
