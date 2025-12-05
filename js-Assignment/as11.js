const stars = document.querySelectorAll(".rating span");
const result = document.querySelector(".result");
let selectedRating = 0;

// Highlight on hover
stars.forEach(star => {
  star.addEventListener("mouseover", () => {
    resetHover();
    highlightStars(star.dataset.value);
  });

  // When mouse leaves rating area — keep only selected rating
  star.addEventListener("mouseleave", () => {
    resetHover();
    highlightStars(selectedRating, true);
  });

  // Click to select rating
  star.addEventListener("click", () => {
    selectedRating = star.dataset.value;
    result.textContent = `Your Rating: ${selectedRating}`;
    resetSelect();
    highlightStars(selectedRating, true);
  });
});

// Highlight stars
function highlightStars(value, select = false) {
  stars.forEach(star => {
    if (star.dataset.value <= value) {
      star.classList.add(select ? "selected" : "hovered");
    }
  });
}

// Remove hover highlights
function resetHover() {
  stars.forEach(star => star.classList.remove("hovered"));
}

// Remove selected highlights
function resetSelect() {
  stars.forEach(star => star.classList.remove("selected"));
}
