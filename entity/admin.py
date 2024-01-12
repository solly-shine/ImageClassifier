from django.contrib import admin
from .models import Entity, Classification, Prediction
# Register your models here.
from django.utils.html import format_html



class PredictionManager(admin.ModelAdmin):
    list_display = ('entity_name', 'classification_title', 'probability')
    readonly_fields = ('entity', 'classification', 'probability')
    
class InlinePredictionManager(admin.TabularInline):
    model = Prediction
    extra = 0
    readonly_fields = ('entity', 'classification', 'probability')
    
    
class ClassificationManager(admin.ModelAdmin):
    list_display = ('id', 'title')
    list_display_links = ('id', 'title')
    readonly_fields = ('id', )


class EntityManager(admin.ModelAdmin):
    def img_thumbnail(self, obj):
        return format_html('<img src="{}" width="32" height="32" style="border-radius: 30%" /> '.format(obj.image.url))

    list_display = ('name', 'img_thumbnail', 'date_created', 'date_modified', )
    list_display_links = ('name', 'img_thumbnail')
    readonly_fields = ('date_modified', 'date_created')
    img_thumbnail.short_description = "Image"
    inlines = (InlinePredictionManager, )


admin.site.register(Prediction, PredictionManager)
admin.site.register(Classification, ClassificationManager)
admin.site.register(Entity, EntityManager)
