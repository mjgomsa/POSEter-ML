const buttons = document.querySelectorAll(".styleButton");

// Add click event listener to each button
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove the "selected" class from all buttons
    buttons.forEach((btn) => btn.classList.remove("selected"));

    // Add the "selected" class to the clicked button
    button.classList.add("selected");
  });
});
