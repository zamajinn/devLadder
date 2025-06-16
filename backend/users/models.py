from django.contrib.auth.models import AbstractUser
from django.db import models

class Organization(models.Model):
    name = models.CharField(max_length=100)

class User(AbstractUser):
    organization = models.ForeignKey(Organization, null=True, blank=True, on_delete=models.SET_NULL)
    role = models.CharField(max_length=50, default="member")