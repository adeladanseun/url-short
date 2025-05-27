from django.contrib import admin
from .models import URL

@admin.register(URL)
class URLAdmin(admin.ModelAdmin):
    list_display = ('original_url', 'short_url', 'created_at', 'clicks')
    search_fields = ('original_url', 'short_url')
    readonly_fields = ('clicks',)

# Register your models here.
