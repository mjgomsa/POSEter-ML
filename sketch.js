let font;
let video;
let poseNet;
let poses = [];
let posterDone = false;

let word = "HELLO";

let posArr = [];

let t = 0;
let capturedImage = null;

function preload() {
  font = loadFont("assets/Agrandir-TextBold.otf");
  headerfont = loadFont("assets/Agrandir-Regular.otf");
}

function setup() {
  var canvas = createCanvas(720, 560);
  canvas.parent("sketch-holder");
  setupCamera();
  setupPoseNet();
  populatePosArray(word.length); // Initialize posArr with the starter word length
}

function setupCamera() {
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
}

function setupPoseNet() {
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", function (results) {
    poses = results;
  });
}

function modelReady() {
  // select("#status").html;
  // "model loaded ✍🏼✨〜 design your poster with your body〜"();
}

function draw() {
  if (!posterDone) {
    drawCamera();
  } else {
    drawCompletedPoster();
  }

  drawText();
}

function drawCamera() {
  // flipping the camera horizontally
  t = floor(millis() / 3000);

  if (t < word.length) {
    push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    pop();
  } else {
    posterDone = true;
  }
}

function drawCompletedPoster() {
  background("#FB877F");
  if (capturedImage) {
    push();
    translate(width - 150, height - 150);
    scale(-1, 1);
    image(capturedImage, -140, 15, 160, 120);
    pop();
  }
}

function drawText() {
  // type change
  textSize(250);
  textFont(font);
  fill("#244BD6");

  // using NOSE
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    keypoint = pose.keypoints[0];

    if (keypoint && keypoint.score > 0.2) {
      t = floor(millis() / 3000);
      if (t < word.length) {
        // Ensure posArr is populated based on the number of letters in the word
        posArr[t] = [width - keypoint.position.x, keypoint.position.y];
      } else {
        // Capture the current frame as an image
        if (!capturedImage) {
          capturedImage = video.get();
        }
      }
    }

    // Display the text
    for (let j = 0; j < word.length; j++) {
      if (posArr[j]) {
        text(word[j], posArr[j][0], posArr[j][1]);
      }
    }
  }
}

function updateSketch() {
  // Get the input value from the HTML element
  let newWord = document.getElementById("inputValue").value;

  // Update the word variable
  word = newWord;

  // Adjust posArr length based on the new word length
  populatePosArray(newWord);

  // Redraw the canvas with the updated value
  redraw();
}

function populatePosArray(newWord) {
  let newPosArray = [];

  for (let i = 0; i < newWord.length; i++) {
    if (posArr[i] && posArr[i][0] !== -70 && posArr[i][1] !== -70) {
      newPosArray[i] = posArr[i];
    } else {
      newPosArray[i] = [-70, -70];
    }
  }

  posArr = newPosArray;
}
