const totalSum = document.querySelector(".sum");
const card = document.querySelector(".cards");
const newBtn = document.querySelector(".btn2");
const  startBtn= document.querySelector(".btn1");
const user = document.querySelector(".player");
const msg = document.querySelector(".msg");

let cards = [];
let sum = 0;
let hasBlackJack = false;
let isAlive = false;
let message = "";
let player = {
  name: "You",
  chips: 400,
notice:""
};

const getRandomcard = () => {
  let randomNum = Math.floor(Math.random() * 13) + 1;
  if (randomNum > 10) {
    return 10;
  } else if (randomNum === 1) {
    return 11;
  } else {
    return randomNum;
  }
};
const startgame = () => {
  isAlive = true;
  hasBlackJack = false;
  player.notice=""
  let firstCard = getRandomcard();
  let secCard = getRandomcard();
  cards = [firstCard, secCard];
  sum = firstCard + secCard;
  rendering();
};

const updateChips = (result) => {
  if (result === "win") {
    player.chips += 50;
  } 
  else if (result === "lose") {
    player.chips -= 20;
    if (player.chips <= 0) {
      player.chips = 0;
      player.notice = "<span class='lost'>Insufficient balance</span>";
    }
  }
};

const rendering = () => {
  card.textContent = "Cards: ";
  let total=player.chips;
  for (let i of cards) {
    card.textContent += i + " ";
  }
  totalSum.textContent = "Sum: " + sum;
  if (sum <= 20) {
    message = "<span>DO you want to draw a new card ?</span>";
  } else if (sum === 21) {
    message = "<span class='won'>Whow..! You've got Blackjack..🎉!</span>";
   
    hasBlackJack = true;
    updateChips("win");
  } else {
    message = "<span class='lost'>You're out of the game..😥!</span>";
    
    isAlive = false;
    updateChips("lose");
  }
  
  msg.innerHTML = message;
  user.innerHTML=player.name+" $"+player.chips +" "+ player.notice
};

const newCard = () => {
  if (isAlive === true && hasBlackJack === false) {
    let newCardValue = getRandomcard();
    sum += newCardValue;
    cards.push(newCardValue);
    rendering();
  }
};

newBtn.addEventListener("click", newCard);
startBtn.addEventListener("click", startgame);
