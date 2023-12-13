let font;
let video;
let poseNet;
let poses = [];
let posterDone = false;

let word = "HELLO";

let posArr = [
  [-10, -10],
  [-10, -10],
  [-10, -10],
  [-10, -10],
  [-10, -10],
];

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
    background("#FB877F");

    // Create an image and draw the video onto it
    capturedImage = createImage(width, height);
    capturedImage.copy(
      video,
      0,
      0,
      video.width,
      video.height,
      0,
      0,
      width,
      height
    );

    // Display the captured thumbnail on the canvas
    push();
    translate(width - 150, height - 150);
    scale(-1, 1);
    image(capturedImage, -140, 15, 160, 120);
    pop();

    posterDone = true;
  }
}

function drawCompletedPoster() {
  console.log("stop camera now");
  video.remove();
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
    if (keypoint.score > 0.2) {
      t = floor(millis() / 3000);
      if (t < 5) {
        posArr[t] = [width - keypoint.position.x, keypoint.position.y];
      } else {
        // Capture the current frame as an image
        if (!capturedImage) {
          capturedImage = video.get();
        }
      }
    }

    // Display the text
    for (j = 0; j < word.length; j++) {
      if (j < word.length) {
        // Check if the index is within the length of the word
        text(word[j], posArr[j][0], posArr[j][1]);
      }
    }
  }
}

function updateSketch() {
  // Get the input value from the HTML element
  word = document.getElementById("inputValue").value;
  // Redraw the canvas with the updated value
  redraw();
}
