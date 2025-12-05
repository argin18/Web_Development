let obj = {
  name: "Prakash",
  age: 111,
  hairColor: "black",
  likes: "food",
};

const btn = document.querySelector(".btn");
const output = document.querySelector(".out");
// exchanging key and value
let obj2 = {};
const exChanging = () => {
  
  for (let key in obj) {
    obj2[obj[key]]=key;
}
return obj2;
};

btn.addEventListener("click", () => {
  output.innerHTML = JSON.stringify(exChanging(),null,2);
});
