let model;
var canvasWidth             = 200;
var canvasHeight            = 200;
var canvasStrokeStyle       = "white";
var canvasLineJoin          = "round";
var canvasLineWidth         = 10;
var canvasBackgroundColor   = "black";
var canvasId                = "canvas";
var clickX = new Array();
var clickY = new Array();
var clickD = new Array();
var drawing;


var canvasBox = document.getElementById('canvas-box');
var canvas = document.createElement("canvas");

canvas.setAttribute("width", canvasWidth);
canvas.setAttribute("height", canvasHeight);
canvas.setAttribute("id", canvasId);
canvas.style.backgroundColor = canvasBackgroundColor;
canvasBox.appendChild(canvas);
if(typeof G_vmlCanvasManager != 'undefined') {
  canvas = G_vmlCanvasManager.initElement(canvas);
}
 
ctx = canvas.getContext("2d");

// MOUSE DOWN function

$("#canvas").mousedown(function(e) {
    var rect = canvas.getBoundingClientRect();
    var mouseX = e.clientX- rect.left;
    var mouseY = e.clientY- rect.top;
    drawing = true;
    addUserGesture(mouseX, mouseY);
    drawOnCanvas();
});

// TOUCH START function
canvas.addEventListener("touchstart", function(e) {
    if (e.target == canvas) {
        e.preventDefault();
    }

    var rect = canvas.getBoundingClientRect();
    var touch = e.touches[0];

    var mouseX = touch.clientX- rect.left;
    var mouseY = touch.clientY- rect.top;

    drawing = true;
    addUserGesture(mouseX, mouseY);
    drawOnCanvas();
}, false);

// MOUSE MOVE function
$("#canvas").mousemove(function(e) {
    if (drawing) {
        var rect = canvas.getBoundingClientRect();
        var mouseX = e.clientX- rect.left;
        var mouseY = e.clientY- rect.top;
        addUserGesture(mouseX, mouseY, true);
        drawOnCanvas();
    }
});

// TOUCH MOVE function
canvas.addEventListener("touchmove", function(e) {
    if (e.target == canvas) {
        e.preventDefault();
    }

    if(drawing) {
        var rect = canvas.getBoundingClientRect();
        var touch = e.touches[0];

        var mouseX = touch.clientX- rect.left;
        var mouseY = touch.clientY- rect.top;

        addUserGesture(mouseX, mouseY, true);
        drawOnCanvas();
    }
    
}, false);

// MOUSE UP function
$("#canvas").mouseup(function(e) {
    drawing = false;
});

// TOUCH END function
canvas.addEventListener("touchend", function(e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
    drawing = false
}, false);

// MOUSE LEAVE function
$("#canvas").mouseleave(function(e) {
    drawing = false;
});

// TOUCH LEAVE function
canvas.addEventListener("touchleave", function(e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
    drawing = false
}, false);

// ADD CLICK function
function addUserGesture(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickD.push(dragging);
}

// RE DRAW function
function drawOnCanvas() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.strokeStyle = canvasStrokeStyle;
    ctx.lineJoin = canvasLineJoin;
    ctx.lineWidth = canvasLineWidth;

    for (var i = 0; i < clickX.length; i++) {
        ctx.beginPath();
        if (clickD[i] && i) {
            ctx.moveTo(clickX[i-1], clickY[i-1]);
        } else {
            ctx.moveTo(clickX[i]-1, clickY[i]);
        }
        ctx.lineTo(clickX[i], clickY[i]);
        ctx.closePath();
        ctx.stroke();
    }
}

// CLEAR CANVAS function
$("#clear-btn").click(function () {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    clickX = new Array();
    clickY = new Array();
    clickD = new Array();
    $(".prediction-text").empty();
    $("#result_box").addClass('d-none');
});

// Load CNN model

async function loadModel() {
    model = undefined;
    model = await tf.loadLayersModel(
        "./DeepLearning.AI TensorFlow Developer/C1_Introduction to TensorFlow/W2_Introduction to CV/artifacts/model/model.json"
      );
}

loadModel();

// Preprocess Canvas

function preprocessCanvas(image) {
    let tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([28, 28])
        .mean(2)
        .expandDims(2)
        .expandDims()
        .toFloat();
    
        return tensor.div(255.0);
}

$("#predict-button").click(async function predict() {
    // get iomage data from canvas
    var imageData = canvas.toDataURL();

    // preprocess canvas
    let tensor = preprocessCanvas(canvas);

    // make predictions on image tensor
    let predictions = await model.predict(tensor).data();

    // get prediction results
    let results = Array.from(predictions);

    // display predictions in chart
    $("#result_box").removeClass('d-none');
    displayChart(results);
    displayLabel(results);
});

// Chart to display predictions
var chart = "";
var firstTime = 0;
function loadChart(label, data) {
    var ctx = document.getElementById('chart_box').getContext('2d');
    chart = new Chart(ctx, {
        // type of chart
        type: 'bar',

        // data for chart
        data: {
            labels: label,
            datasets: [{
                label: "Prediction Confidence",
                backgroundColor: 'rgb(82, 196, 211)',
                borderColor: 'rgb(82, 196, 211)',
                color: 'white',
                tickColor: 'white',
                data: data
            }]
        },
        // config options
        options: {
            responsive: true,
            plugins: { 
                legend: {
                  labels: {
                    color: "white",
                    font: {
                      size: 18
                    }
                  }
                }
              },
              scales: {
                y: { 
                  ticks: {
                    color: "white",
                    font: {
                      size: 10,
                    }
                  }
                },
                x: {
                  ticks: {
                    color: "white",
                    font: {
                      size: 10
                    }
                  }
                }
            }
        }
    });
}

// display chart from updated canvas drawing
function displayChart(data) {

    label = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    if (firstTime == 0) {
        loadChart(label, data);
        firstTime = 1;
    } else {
        chart.destroy();
        loadChart(label, data);
    }

    document.getElementById('chart_box').style.display = "block";
}

function displayLabel(data) {
    var max = data[0];
    var maxIndex = 0;

    for (var i = 1; i < data.length; i++) {
        if (data[i] > max) {
            maxIndex = i;
            max = data[i];
        }
    }
    $(".prediction-text").html("<h2>Predicted Digit: <b>"+maxIndex+"</b><br>Confidence:<b>"+Math.trunc(max*100)+"%</b></h2>")
}