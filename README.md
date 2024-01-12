# Django + React
React app and a django webserver, designed as a image gallery used for Image Classification.

# Changes:
# Front:
* After uploading the app will show the classiciations of each image, with its probability
* Progress bar enhanced
* Uploading alerts, is now simultaniously; while uploading of each image done, its alert will show imeediately;
* Ui enhanced

# Server:
* Classification algorythms implemented; both ResNet50 and InceptionResNetV2 are supported.
* Each image has Predictions model items related to it;
* Prediction model contains a classification, an the entity related to it, and the probability of prediction,
	which is the accuracy of the algorythm
* CRUD APIs for Prediction nd Classification model implemented;
* Added an extra API For Prediction model, that will all related predictions to the ID of an entity provided in API url
	* This is used in frontend section, for showing the predictions of each Image uploaded.
