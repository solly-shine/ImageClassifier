from django.db import models

# Create your models here.
class Entity(models.Model):
    name = models.CharField(max_length=256)
    image = models.ImageField(upload_to="entity")
    classification = models.CharField(max_length=256, blank=True)
    date_modified = models.DateTimeField(auto_now=True)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} [{self.modify_date.strftime('%Y-%m-%d %H:%M')}]"

    class Meta:
        verbose_name = 'Entity'
        verbose_name_plural = 'Entities'
