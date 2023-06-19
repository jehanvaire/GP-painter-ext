document.getElementById("loadImageButton").addEventListener("click", loadImage);
document.getElementById("waitForSpace").addEventListener("click", waitForSpace);
document.getElementById("sendData").addEventListener("click", sendData);

function loadImage() {
  // Load an image and display it in the image container
  console.log("loadImage");
}

function waitForSpace() {
  // Show a message that we are waiting for the user to press the 'space' key
  // Then, get the mouse absolute position
  console.log("waitForSpace");
}

function sendData() {
  // Send the image and the mouse position to the API
  // Then, display the result in the result container
  console.log("sendData");
}
