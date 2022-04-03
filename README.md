# Digit Recognizer

Much credit is due to this repository for helping with the Javascript and modeling parts of this program: https://github.com/maneprajakta/Digit_Recognition_Web_App

A deployment of this project is available at

To Run:
1. Download Zip
2. Unzip
3. Open index.html

### Parts of application
- Models: the models folder contains the Keras backend .json file (**model.json**) of the model used in **model.ipynb**, as well as the weights and biases in an h5 file  and a bin file to execute the model on the backend. The backend is served by Github.
- Javascript: this section contains the code for the drawing canvas as well as the implementation of TensorFlow into the webpage
- index.html: this is the html file for the program; click this after unzipping the folder

# Model
This project utilizes a Deep Neural Network built with Keras and implemented into the web browser using TensorFlow JS.

The model contains a single Dense layer consisting of 512 neurons and and a Dropout layer with a weight of 0.6. These layers map to a Dense layer of 10 neurons corresponding to the possible digits (0-9).

The model is trained for 15 epochs, then is evaluated with the x_test, y_test, and a summary of the model is printed at the end.

The model and its accompanying data is saved in the models folder for future reference.

# Webpage
The webpage utilizes TensorFlow JS, Bootstrap, and a simple canvas intended for the user to draw a digit. Images are converted to tensors that get processed in the backend (main.js).

**NOTE:** Much of the code has been optimized for easier reading. However, some sections may still be unclear for the typical developer passing through
