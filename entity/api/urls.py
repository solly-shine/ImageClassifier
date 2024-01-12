from .views import EntityViewSet, PredictionViewSet, ClassificationViewSet
from rest_framework import routers
from django.urls import  path, include

app_name = 'entity-api'

router = routers.DefaultRouter()
router.register(r'entities', EntityViewSet)
router.register(f'predictions', PredictionViewSet)
router.register(r'classifications', ClassificationViewSet)

urlpatterns = [
    path('predictions/entity/<int:id>/', PredictionViewSet.as_view({'get': 'list_by_entity'}), name='entity-prediction'),
    
    path('', include(router.urls)),
]
