document.getElementById("ai").addEventListener("change", toggleAi) //For toggle button of AI
//document.getElementById("fps").addEventListener("input", changeFps)

const video = document.getElementById("video");  
const c1 = document.getElementById('c1');
const ctx1 = c1.getContext('2d');              //Declarations and Global Variables.
let cameraAvailable = false;
let aiEnabled = false;
let fps = 16;


let facingMode = "environment"; //Is used for accessing the camera
let constraints = {             //Function having audio and video setting up where audio is off(disabled) and 
    audio: false,               //video is taken as input from facingMode variable.
    video: {
        facingMode: facingMode
    }
};

//For enabling the camera
camera();
function camera() {            //Camera function is used to check for the camera whether is on or off and based on
    if (!cameraAvailable) {    //it the function will either return or give a catch.
        console.log("camera")
        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) { //Used for the propt to give 
            cameraAvailable = true;                                            //the camera and audio permission.
            video.srcObject = stream;
        }).catch(function (err) {
            cameraAvailable = false;        //If not then it will wait for the camera permissions.
            if (modelIsLoaded) {
                if (err.name === "NotAllowedError") {
                    document.getElementById("loadingText").innerText = "Waiting for camera permission";
                }
            }
            setTimeout(camera, 1000);  //setTimeout is used for the waiting time of 1 second.
        });
    }
}

window.onload = function () {  //It occurs when the object is loaded which will be done in timerCallback function,
    timerCallback();           // so when object is loaded then onload will execute and timercallback is executed.
}

function timerCallback() {
    if (isReady()) {    //isReady is used when the DOM(Document Object model) is ready to be used.
        setResolution();
        ctx1.drawImage(video, 0, 0, c1.width, c1.height); //for getting the video length and breadth.
        if (aiEnabled) {   //If aiEnabled is true then inside then 
            ai();          //ai function will be executed.
        }
    }
    setTimeout(timerCallback, fps);
}

function isReady() {    //The if condition will be executed if model is loaded and the camera is on.
    if (modelIsLoaded && cameraAvailable) {
        document.getElementById("loadingText").style.display = "none";
        document.getElementById("ai").disabled = false;
        return true;
    } else {
        return false;
    }
}

function setResolution() {   //The setresolution will adjust the boundary width with the width of the window.
    if (window.screen.width < video.videoWidth) {
        c1.width = window.screen.width * 0.9;
        let factor = c1.width / video.videoWidth;
        c1.height = video.videoHeight * factor;
    } else if (window.screen.height < video.videoHeight) {
        c1.height = window.screen.height * 0.50;
        let factor = c1.height / video.videoHeight;
        c1.width = video.videoWidth * factor;
    }
    else {
        c1.width = video.videoWidth;
        c1.height = video.videoHeight;
    }
};

function toggleAi() {  //Is responsible for on and off of the AI functionalty for the Object Detection.
    aiEnabled = document.getElementById("ai").checked;
}

function changeFps() {
    fps = 1000 / document.getElementById("fps").value;
}

function ai() {
    // Detect objects in the image element
    objectDetector.detect(c1, (err, results) => {
        console.log(results); // Will output bounding boxes of detected objects
        for (let index = 0; index < results.length; index++) {
            const element = results[index];  //for storing the current index inside element.
            ctx1.font = "15px Arial";  //Font style of object detected is Arial.
            ctx1.fillStyle = "red";  // Color of detected object is red.
            ctx1.fillText(element.label + " - " + (element.confidence * 100).toFixed(2) + "%", element.x + 10, element.y + 15);
            ctx1.beginPath();  //Used for the drawing of red line or boundong boxes.
            ctx1.strokeStyle = "red"; //Color of bounding box is set to red.
            ctx1.rect(element.x, element.y, element.width, element.height); //Creates rectangle with specified height, width.
            ctx1.stroke();  //Used to draw lines around text and shapes.
            console.log(element.label);  //Output the labelled object detected.
        }
    });
}