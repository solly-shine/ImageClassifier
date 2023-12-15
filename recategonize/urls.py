
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import  settings
from . import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('rest_framework.urls')),
    path('api/', include('entity.api.urls', namespace='entity-api')),
    path('', views.index),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
