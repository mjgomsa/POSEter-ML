let font;
let video;
let poseNet;
let poses = [];
// let colorChanged = false;

word = ["H", "E", "L", "L", "O"];
posArr = [
  [-10, -10],
  [-10, -10],
  [-10, -10],
  [-10, -10],
  [-10, -10],
];

t = 0;
capturedImage = null;

// backgroundColor = ['#FB877F', '#74C7B8', '#FDCB82'];
// textColor = ['#244BD6', '#FFFFFF', '#000000'];

// const colorOptions = [
//   { background: '#FB877F', text: '#244BD6' },
//   { background: '#74C7B8', text: '#FFFFFF' },
//   { background: '#FDCB82', text: '#000000' },
// ];

function preload() {
  font = loadFont("assets/Agrandir-TextBold.otf");
  headerfont = loadFont("assets/Agrandir-Regular.otf");
}

function setup() {
  createCanvas(720, 560);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function (results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  select("#status").html(
    "model loaded ✍🏼✨〜 design your poster with your body〜"
  );
}

function draw() {
  // flipping the camera horizontally
  if (t < 5) {
    push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    pop();
  } else {
    background("#FB877F");

    // Display the captured thumbnail on the canvas
    if (capturedImage) {
      push();
      translate(width - 150, height - 150);
      scale(-1, 1);
      image(capturedImage, -140, 15, 160, 120);
      pop();
    }
  }

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
    for (j = 0; j < 5; j++) {
      text(word[j], posArr[j][0], posArr[j][1]);
    }
  }
}
