# Generated by Django 4.2.14 on 2024-09-22 20:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0010_message_conversation'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='conversation',
            options={'ordering': ('-created_at',)},
        ),
    ]
