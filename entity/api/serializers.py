from ..models import Entity, Prediction, Classification
from rest_framework import serializers


class EntitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Entity
        fields = '__all__'
        # or: fields = ('field1', 'field2', ...)


class ClassificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Classification
        fields = '__all__'
        # or: fields = ('field1', 'field2', ...)


class PredictionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Prediction
        fields = '__all__'
        # or: fields = ('field1', 'field2', ...)
