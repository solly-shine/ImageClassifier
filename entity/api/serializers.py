from ..models import Entity
from rest_framework import serializers


class EntitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Entity
        fields = '__all__'
        # or: fields = ('field1', 'field2', ...)
