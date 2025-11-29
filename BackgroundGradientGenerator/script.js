const btn1 = document.querySelector(".btn1");
const btn2 = document.querySelector(".btn2");
const colorCode = document.querySelector(".colorCode");
let hexaDec = "0123456789abcdef";
let c1="#e5c55c";
let c2="#1fc498";


// color generate
const color = () => {
    let add="#";
  for (let i = 0; i < 6; i++) {
    add+=hexaDec[Math.floor(Math.random() * 16)];
  }
  return add;
};
// copy code
colorCode.addEventListener('click',()=>{
navigator.clipboard.writeText(colorCode.innerText)
.then(()=>alert(`Copied color text `))
.catch(()=>alert(`Failed to copy `))
})

// // btn 1
btn1.addEventListener("click", () => {
     c1=color();
    btn1.innerText=c1;
     document.body.style.backgroundImage = `linear-gradient( to right , ${c1}, ${c2})`;
     btn1.style.backgroundImage = `linear-gradient( to right , ${c1}, ${c2})`;
     colorCode.innerHTML=`background-Image:linear-gradient( to right , ${c1}, ${c2})`;
    });


    // // btn 2
    btn2.addEventListener("click", () => {
        c2=color();
        btn2.innerText=c2;
        document.body.style.backgroundImage = `linear-gradient( to right , ${c1}, ${c2})`;
        btn2.style.backgroundImage = `linear-gradient( to right , ${c1}, ${c2})`;
        colorCode.innerHTML=`background-Image:linear-gradient( to right , ${c1},${c2})`;
});
