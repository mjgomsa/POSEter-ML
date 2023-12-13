document.addEventListener("DOMContentLoaded", function () {
  // Function to capture screenshot using html2canvas
  function captureScreenshot() {
    html2canvas(document.getElementById("defaultCanvas0")).then(function (
      canvas
    ) {
      // Resize the captured image to a smaller size
      var resizedCanvas = document.createElement("canvas");
      var resizedContext = resizedCanvas.getContext("2d");
      resizedCanvas.width = 300; // Adjust the desired width
      resizedCanvas.height = (300 / canvas.width) * canvas.height;

      // Draw the captured image on the resized canvas
      resizedContext.drawImage(
        canvas,
        0,
        0,
        resizedCanvas.width,
        resizedCanvas.height
      );

      // Create an image element from the resized canvas
      var screenshotImage = document.createElement("img");
      screenshotImage.src = resizedCanvas.toDataURL("image/png");

      // Create a div to hold the screenshot
      var screenshotDiv = document.createElement("div");
      screenshotDiv.className = "screenshot-item";
      screenshotDiv.appendChild(screenshotImage);

      // Insert the screenshot at the beginning of the gallery
      var gallery = document.querySelector(".gallery");
      gallery.insertBefore(screenshotDiv, gallery.firstChild);

      // Save the resized image data to localStorage
      saveImageToLocalStorage(screenshotImage.src);
    });
  }

  // Function to save image data to localStorage
  function saveImageToLocalStorage(imageData) {
    var savedImages = JSON.parse(localStorage.getItem("savedImages")) || [];
    savedImages.unshift(imageData);
    localStorage.setItem("savedImages", JSON.stringify(savedImages));
  }

  // Load saved images from localStorage on page load
  function loadSavedImages() {
    var savedImages = JSON.parse(localStorage.getItem("savedImages")) || [];
    var gallery = document.querySelector(".gallery");

    savedImages.forEach(function (imageData) {
      var screenshotImage = document.createElement("img");
      screenshotImage.src = imageData;

      var screenshotDiv = document.createElement("div");
      screenshotDiv.className = "screenshot-item";
      screenshotDiv.appendChild(screenshotImage);

      gallery.appendChild(screenshotDiv);
    });
  }

  // Event listener for the "Capture Screenshot" button
  var captureButton = document.getElementById("capture-screenshot");
  if (captureButton) {
    captureButton.addEventListener("click", captureScreenshot);
  }

  // Load saved images on page load
  loadSavedImages();
});
