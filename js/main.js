var canvas, pad, touchX, touchY;
var mouseX, mouseY, mouseDown=0;

// Initializes canvas for webpage
function initialize() {
    canvas = document.getElementById('sketchpad');
    pad = canvas.getContext('2d');
    pad.fillStyle = "black";
    pad.fillRect(0, 0, canvas.width, canvas.height);

    canvasB = document.getElementById('scaledformodel');
    padB = canvasB.getContext('2d');
    padB.fillStyle = "black";
    padB.fillRect(0, 0, canvas.width, canvas.height);

    canvas.addEventListener('mousedown', sketchpad_mouseDown, false);
    canvas.addEventListener('mousemove', sketchpad_mouseMove, false);
    window.addEventListener('mouseup', sketchpad_mouseUp, false);
}

function draw(pad, x, y, size, isDown) {
    if (isDown) {
        pad.beginPath();
        pad.strokeStyle = "white";
        pad.lineWidth = '30';
        pad.lineJoin = pad.lineCap = 'round';
        pad.moveTo(recentX, recentY);
        pad.lineTo(x, y);
        pad.closePath();
        pad.stroke();
        // Real-Time Model Tracing
        let tensorA = tf.browser.fromPixels(canvas).resizeNearestNeighbor([28, 28]);
        tensorA = tensorA.resizeNearestNeighbor([420, 420]);
        tf.browser.toPixels(tensorA, document.getElementById('scaledformodel'));
    }

    recentX = x;
    recentY = y;
}

//Event handlers
function sketchpad_mouseDown() {
    mouseDown = 1;
    draw(pad, mouseX, mouseY, 12, false );
}

function sketchpad_mouseUp() {
    mouseDown = 0;
}

function sketchpad_mouseMove(e) {
    getMousePos(e);
    if (mouseDown === 1) {
        draw(pad, mouseX, mouseY, 12, true);
    }
}

function getMousePos(e) {
    if (e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if (e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }
}

document.getElementById('wipe_button').addEventListener("click", function() {
    pad.clearRect(0, 0, canvas.width, canvas.height);
    pad.fillStyle = "black";
    pad.fillRect(0, 0, canvas.width, canvas.height);

    padB.clearRect(0, 0, canvas.width, canvas.height);
    padB.fillStyle = "black";
    padB.fillRect(0, 0, canvas.width, canvas.height);

    console.log("Canvas wiped!")
});

// TensorFlow JS Section

let model;
// asynchronous function to load in the model in the interim where the page is loading and user is drawing a digit
(async function(){
    model = await tf.loadLayersModel("https://raw.githubusercontent.com/brycklen/ML-MNIST-MODEL-ENDPOINT/main/model.json")
})();

function loadCanvas(image) {
    // creating a tensor (multidimensional array) from canvas image and fitting it to work with the model
    // model needs input of [integer, 28, 28] for it to function properly
    let tensor = tf.browser.fromPixels(image).resizeNearestNeighbor([28, 28]).mean(2).expandDims();
    // scaling RGB values to 0-1 scale by dividing by 255, just like how it was done in model.ipynb
    return tensor.div(255);
}

// Predict Button
document.getElementById('guess_button').addEventListener("click", async function(){
    let tensor = loadCanvas(canvas);
    let predictions = await model.predict(tensor).data();
    let results = Array.from(predictions);
    processResults(results);
    console.log(results);
});

function processResults(data) {
    var maximum = data[0];
    var maxIndex = 0;
    var secondMaximum = data[0];
    var secondIndex = 0;

    // Saves the main prediction for the model
    for (var i = 1; i < data.length; i++) {
        if (data[i] > maximum) {
            maxIndex = i;
            maximum = data[i];
        }
    }

    // Saves the second best prediction for the model
    for (var j = 1; j < data.length; j++) {
        if (data[j] < maximum && data[j] > secondMaximum) {
            secondIndex = j;
            secondMaximum = data[j];
        }
    }

    console.log("I am " + (maximum * 100).toFixed(2) + "% sure this is right")
    document.getElementById('result').innerHTML = maxIndex;
    document.getElementById('resultTwo').innerHTML = "2nd Best Guess: " + secondIndex;
}