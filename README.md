# Django + React
React app and a django webserver, designed as a image gallery used for Image Classification.

# Changes:
# Front:
* Spinner added for loading.
	* For example when selecting images or uploading it will be shown.
* Selected image type format checking. Not supported files will be ignore.
* Used font-awsome and react-bootstrap
* Added icons and animations to dropbox
* API: implemented api sections to communicate with server.
	* for now getEntities & uploadImage api's implemented;
	* getEntities is used when the app load; (result is logged using console.log)
	* uploadImage is used in Uploadbox component
* Upload button added and uploading logic implemented.
* Error handling & logging; every error about selecting and uploading images has been handled with proper message;
	Success messages are also logged to notify the user.
* After upload the user will see 'Show upload history' that will take the user to /api/entities section and can see every images uploaded so far.

* Github repo updated and a Demo is running now on: https://solly-shine.github.io/ImageClassifier
# Server:
* All four http methods [get, post, put, delete] handled.
* you can see and can upload, edit or delete all the images uploaded so far in /api/entities.
* admin login page: /admin; after login user will be redirected to 'Admin Panel'
* Uploaded on a free hosting service: glitch.communicate
	* URL: https://bronzed-dull-silene.glitch.me/
