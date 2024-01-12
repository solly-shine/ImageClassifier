from rest_framework import viewsets
from .serializers import EntitySerializer, ClassificationSerializer, PredictionSerializer
from ..models import Entity, Prediction, Classification
from rest_framework.response import Response
from decouple import config


HOSTNAME = config('HOSTNAME')
class EntityViewSet(viewsets.ModelViewSet):
    queryset = Entity.objects.all().order_by('-date_created')
    serializer_class = EntitySerializer


class PredictionViewSet(viewsets.ModelViewSet):
    queryset = Prediction.objects.all().order_by('-entity__date_created')
    serializer_class = PredictionSerializer

    
    def list_by_entity(self, request, *args, **kwargs):
        # Extract the id from the URL
        id_param = kwargs.get('id')

        # Filter the queryset based on entity_id=id
        queryset = Prediction.objects.filter(entity_id=id_param)
        if len(queryset):
            class_titles = dict()
            for q in queryset:
                class_titles[q.classification.id] = q.classification.Title()
                
            # Serialize the queryset
            serializer = self.get_serializer(queryset, many=True)
            serializer.data[0]['image'] = HOSTNAME + queryset[0].entity.image.url
            for pred in serializer.data:
                pred['classification'] = class_titles[pred['classification']]
            # for pred in serializer.data:
            #     pred['image'] = 'test;'
            # Return the serialized data as a response
        return Response(serializer.data)
    

class ClassificationViewSet(viewsets.ModelViewSet):
    queryset = Classification.objects.all().order_by()
    serializer_class = ClassificationSerializer
