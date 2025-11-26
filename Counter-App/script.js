const incre = document.querySelector(".inc");
const decre = document.querySelector(".dec");
const reset = document.querySelector(".reset");
let pInc = document.querySelector("#incCount");
let pDec = document.querySelector("#decCount");
let totalDisplay = document.querySelector("#count");

let incrementCount = 0;
let decrementCount = 0;

// for increament btn
incre.addEventListener("click", () => {
  incrementCount++;
  pInc.innerHTML = incrementCount;
  display();
});

// for Drecreament btn
decre.addEventListener("click", () => {
  decrementCount++;
  pDec.innerHTML = decrementCount;
  display();
});

// display
const display = () => {
  totalDisplay.innerHTML = incrementCount - decrementCount;
};

// reset btn
reset.addEventListener("click", () => {
  incrementCount = 0;
  decrementCount = 0;
  totalDisplay.innerHTML = 0;
  pInc.innerHTML = incrementCount;
  pDec.innerHTML = decrementCount;
});
