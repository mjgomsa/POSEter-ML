// captureSC.js

document.addEventListener("DOMContentLoaded", function () {
  // Function to capture screenshot using html2canvas
  function captureScreenshot() {
    html2canvas(document.getElementById("defaultCanvas0")).then(function (
      canvas
    ) {
      // Create an image element from the canvas
      var screenshotImage = document.createElement("img");
      screenshotImage.src = canvas.toDataURL("image/png");

      // Create a div to hold the screenshot
      var screenshotDiv = document.createElement("div");
      screenshotDiv.className = "screenshot-item";
      screenshotDiv.appendChild(screenshotImage);

      // Append the screenshot to the gallery
      document.querySelector(".gallery").appendChild(screenshotDiv);
    });
  }

  // Event listener for the "Capture Screenshot" button
  var captureButton = document.getElementById("capture-screenshot");
  if (captureButton) {
    captureButton.addEventListener("click", captureScreenshot);
  }
});
