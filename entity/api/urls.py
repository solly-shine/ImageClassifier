from .views import EntityViewSet
from rest_framework import routers
from django.urls import  path, include

app_name = 'entity-api'

router = routers.DefaultRouter()
router.register(r'entity', EntityViewSet)

urlpatterns = [
    path('', include(router.urls))
]
