from django.db import models
from django.contrib.auth.models import User
import random
import string
from django.contrib.auth.hashers import make_password, check_password

def generate_short_url():
    length = 6
    chars = string.ascii_letters + string.digits
    while True:
        short_url = ''.join(random.choice(chars) for _ in range(length))
        if not URL.objects.filter(short_url=short_url).exists():
            return short_url

class URL(models.Model):
    original_url = models.URLField()
    short_url = models.CharField(max_length=15, unique=True, default=generate_short_url)
    created_at = models.DateTimeField(auto_now_add=True)
    clicks = models.IntegerField(default=0)
    password = models.CharField(max_length=128, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    is_password_protected = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.original_url} -> {self.short_url}"

    def set_password(self, password, oldpassword=None):
        if (self.password and self.check_password(oldpassword)) or (not self.password):
            if password:
                self.password = make_password(password)
                self.is_password_protected = True
            else:
                self.password = None
                self.is_password_protected = False
            return True
        else:
            #print('failed to set password')
            return False

    def check_password(self, password):
        if not self.is_password_protected:
            return True
        if not password:
            return False
        return check_password(password, self.password)
