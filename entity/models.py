from typing import Iterable
from django.db import models
import entity.utils as utils
from django.core.exceptions import ObjectDoesNotExist


MIN_ACCEPTABLE_PROBABILITY = 0.01

class Classification(models.Model):
    id = models.CharField(max_length=16, primary_key=True)  # provided by image-net
    title = models.CharField(max_length=64)    
    
    def Title(self) -> str:
        return utils.CapitalizeFirstLetters(self.title, '_')

    def __str__(self) -> str:
        # title provided by imagenet is lowercase and separated by underscores
        return self.Title()


# Create your models here.
class Entity(models.Model):
    name = models.CharField(max_length=64, default="Unnamed")
    image = models.ImageField(upload_to="entity", null=False, blank=False)
    date_modified = models.DateTimeField(auto_now=True)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Entity'
        verbose_name_plural = 'Entities'

    def save(self, *args, **kwargs) -> None:
        
        self.name = utils.extract_name_from_file(self.image.name)
        result = super().save(*args, **kwargs)
        try:
            top_predictions = utils.predict_classification(self.image.path)
            if len(top_predictions):
                top_predictions = top_predictions[0]
                for pred in top_predictions:
                    _id, title, probability = pred
                    
                    if probability >= MIN_ACCEPTABLE_PROBABILITY:
                        classification = None
                        try:
                            classification = Classification.objects.get(id=_id)
                        except ObjectDoesNotExist:
                            classification = Classification(id=_id, title=title)
                            classification.save()
                            
                        if classification:
                            prediction = Prediction(entity=self, classification=classification, probability=probability * 100)
                            prediction.save()
                            
        except Exception as ex:
            print('Categorizing failure! ', ex)
        return result
    

class Prediction(models.Model):
    entity = models.ForeignKey(Entity, on_delete=models.CASCADE)
    classification = models.ForeignKey(Classification, on_delete=models.CASCADE)
    probability = models.FloatField(default=0)

    def entity_name(self) -> str:
        return self.entity.name
    
    def classification_title(self) -> str:
        return self.classification.title
    
    def __str__(self):
        return f'{self.probability: .4f}% {self.classification.__str__()}'

