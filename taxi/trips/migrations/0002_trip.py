# Generated by Django 3.0.3 on 2020-02-04 20:19

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('trips', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Trip',
            fields=[
                ('id', models.UUIDField(default=uuid.UUID('ebaaced7-6033-476e-86d3-e51cf5982942'), editable=False, primary_key=True, serialize=False)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('pick_up_address', models.CharField(max_length=255)),
                ('drop_off_address', models.CharField(max_length=255)),
                ('status', models.CharField(choices=[('REQUESTED', 'REQUESTED'), ('STARTED', 'STARTED'), ('IN_PROGRESS', 'IN_PROGRESS'), ('COMPLETED', 'COMPLETED')], default='REQUESTED', max_length=128)),
            ],
        ),
    ]
