const time = document.querySelector(".time");

let currentTime = () => {
  let curr = new Date().toLocaleTimeString();
  time.textContent = curr;
  console.log(curr);
};

setInterval(currentTime, 1000);
currentTime();
