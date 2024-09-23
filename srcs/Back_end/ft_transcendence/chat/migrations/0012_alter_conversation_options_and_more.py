# Generated by Django 4.2.14 on 2024-09-23 09:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0011_alter_conversation_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='conversation',
            options={},
        ),
        migrations.RemoveField(
            model_name='conversation',
            name='created_at',
        ),
        migrations.AddField(
            model_name='conversation',
            name='content_of_last_message',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='conversation',
            name='last_message_time',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]
