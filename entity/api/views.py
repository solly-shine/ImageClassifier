from rest_framework import viewsets
from .serializers import EntitySerializer
from ..models import Entity


class EntityViewSet(viewsets.ModelViewSet):
    queryset = Entity.objects.all().order_by('-date_created')
    serializer_class = EntitySerializer
