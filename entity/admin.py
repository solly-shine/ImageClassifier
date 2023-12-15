from django.contrib import admin
from .models import Entity
# Register your models here.
from django.utils.html import format_html


class EntityManager(admin.ModelAdmin):
    def img_thumbnail(self, obj):
        return format_html('<img src="{}" width="32" height="32" style="border-radius: 30%" /> '.format(obj.image.url))

    list_display = ('img_thumbnail', 'name', 'date_modified', 'classification',)
    img_thumbnail.short_description = "Image"

admin.site.register(Entity, EntityManager)
