const btn = document.querySelector(".btn");
const num = document.querySelector(".num");
const p = document.querySelector("p");
let i = 0;
let isFollowing = false;
if (i > 0) {
  p.style.display = "block";
  num.innerHTML = i;
}
if (i === 0) {
  p.style.display = "none";
}

btn.addEventListener("click", () => {
  if (!isFollowing) {
    i++;
    btn.innerHTML = "following";
    isFollowing = true;
    if (i > 0) {
      p.style.display = "block";
    }
  } else {
    if (i > 0) i--;
    btn.innerHTML = "follow";
    isFollowing = false;
    if (i === 0) {
      p.style.display = "none";
    }
  }
  num.innerHTML = i;
});
