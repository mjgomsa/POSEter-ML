let word;
let selectedButton;
let numSecPerLetter = 3;
let prevSelectedButton;

let canvas;
let font1;
let font2;
let font3;
let font4;
let defaultFont;

let video;
let poseNet;
let poses = [];
let posterDone = false;
let posArr = [];
let capturedImage = null;
let startTime;
let time = 0;
let letterIndex = 0;

function preload() {
  font1 = loadFont("assets/Agrandir-TextBold.otf");
  font2 = loadFont("assets/ClarendonLTStd.otf");
  font3 = loadFont("assets/DMMono-Regular.ttf");
  font4 = loadFont("assets/Ogg-Roman.otf");
  defaultFont = "Arial"; // default
}

function setup() {
  canvas = createCanvas(720, 560);
  canvas.parent("sketch-holder");
  // Set the default font when the sketch is initialized
  textFont(defaultFont);
  setupCamera();
  setupPoseNet();
}

function draw() {
  background(220);

  // if data has been received
  if (word !== undefined && selectedButton !== undefined) {
    if (!startTime) {
      startTime = millis();
    }

    time = floor((millis() - startTime) / (numSecPerLetter * 1000));
    letterIndex = floor(time / numSecPerLetter) % word.length;
    // console.log(time + " ?" + word.length);

    if (time === word.length) {
      posterDone = true;
      // console.log("posterDone!");
    }

    // Display the selected data on the canvas
    textAlign(CENTER, CENTER);

    // Use the appropriate font based on the selected button
    switch (selectedButton) {
      case 1:
        if (!posterDone) {
          background(0, 0);
          drawCamera();
        } else {
          background("#FB877F");
          drawCompletedPoster();
        }
        drawText(font1, "#244BD6");
        break;
      case 2:
        if (!posterDone) {
          background(0, 0);
          drawCamera();
        } else {
          background("#FFD39E");
          drawCompletedPoster();
        }
        drawText(font2, "#F12C11");
        break;
      case 3:
        if (!posterDone) {
          background(0, 0);
          drawCamera();
        } else {
          background("#A8E6F9");
          drawCompletedPoster();
        }
        drawText(font3, "#000000");
        break;
      case 4:
        if (!posterDone) {
          background(0, 0);
          drawCamera();
        } else {
          background("#F8EFFE");
          drawCompletedPoster();
        }
        drawText(font4, "#000000");
        // drawCamera();
        // textFont(font4);
        // background("#F8EFFE");
        break;
      default:
        // Use the default font if the selected button is not recognized
        textFont(defaultFont);
        break;
    }
  } else {
    // Display loading state
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(0);
    text("🕺loading...", width / 2, height / 2);
  }
}

function selectButton(buttonNumber) {
  // Remove the 'selected' class from all buttons
  const buttons = document.querySelectorAll(".buttonSelect");
  buttons.forEach((button) => button.classList.remove("selected"));

  // Add the 'selected' class to the clicked button
  selectedButton = buttonNumber;
  const selectedButtonElement = document.querySelector(
    `.buttonSelect[data-button="${buttonNumber}"]`
  );
  selectedButtonElement.classList.add("selected");
}

function applyChanges() {
  // Get input data from the form
  word = document.getElementById("inputField").value;

  // Check if all required data is available
  if (word !== "" && selectedButton !== undefined) {
    // Trigger redraw with the new data
    populatePosArray(word);
    redraw();
  } else {
    alert("Please fill in all the required fields.");
  }
}

function setupCamera() {
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
}

function setupPoseNet() {
  poseNet = ml5.poseNet(video);
  poseNet.on("pose", function (results) {
    poses = results;
  });
}

function populatePosArray(newWord) {
  console.log("populating pos Array...");

  // Check if newWord is not empty
  if (newWord.length === 0) {
    console.warn("Warning: The word is empty.");
    return;
  }

  let newPosArray = [];

  for (let i = 0; i < newWord.length; i++) {
    if (posArr[i] && posArr[i][0] !== -90 && posArr[i][1] !== -90) {
      newPosArray[i] = posArr[i];
    } else {
      newPosArray[i] = [-90, -90];
    }
  }

  posArr = newPosArray;
  console.log(posArr);
}

function drawCamera() {
  // flipping the camera horizontally
  if (!posterDone) {
    push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    pop();
  }
}
// function drawCamera() {
//   // flipping the camera horizontally
//   if (time < word.length) {
//     push();
//     translate(width, 0);
//     scale(-1, 1);
//     image(video, 0, 0, width, height);
//     pop();
//   } else {
//     posterDone = true;
//   }
// }

function drawText(fontN, fontColor) {
  // type change
  textSize(250);
  textFont(fontN);
  fill(fontColor);

  // using NOSE
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    keypoint = pose.keypoints[0]; //select nose

    if (keypoint && keypoint.score > 0.2) {
      if (!posterDone && time < word.length) {
        // Ensure posArr is populated based on the number of letters in the word
        posArr[time] = [width - keypoint.position.x, keypoint.position.y];
      } else {
        // Capture the current frame as an image
        if (!capturedImage && posterDone) {
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
// function drawText(fontN, fontColor) {
//   // type change
//   textSize(250);
//   textFont(fontN);
//   fill(fontColor);

//   // using NOSE
//   for (let i = 0; i < poses.length; i++) {
//     let pose = poses[i].pose;
//     keypoint = pose.keypoints[0]; //select nose

//     if (keypoint && keypoint.score > 0.2) {
//       if (time < word.length) {
//         // Ensure posArr is populated based on the number of letters in the word
//         posArr[time] = [width - keypoint.position.x, keypoint.position.y];
//       } else {
//         // Capture the current frame as an image
//         if (!capturedImage) {
//           capturedImage = video.get();
//         }
//       }
//     }

//     // Display the text
//     for (let j = 0; j < word.length; j++) {
//       if (posArr[j]) {
//         text(word[j], posArr[j][0], posArr[j][1]);
//       }
//     }
//   }
// }

function drawCompletedPoster() {
  if (capturedImage) {
    push();
    translate(width - 150, height - 150);
    scale(-1, 1);
    image(capturedImage, -140, 15, 160, 120);
    pop();
  }
}
