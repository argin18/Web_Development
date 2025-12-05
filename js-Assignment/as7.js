const inp = document.querySelector("input");
const btn = document.querySelector(".btn");
const output = document.querySelector(".output");

// protect email
const protect = (str) => {
  if (str.indexOf("@") === -1) {
    return `invalid email address please Enter valid email...!`;
  } else {
    let sp = str.split("@");
    let s = sp[0].split("");
    let c = "";
    for (let i = 0; i < s.length / 2; i++) {
      c += s[i];
    }
    sp[0] = `${c}...`;
    return sp.join("@");
  }
};
// console.log(protect("sumitbhujel@gmail.com"))
btn.addEventListener("click", () => {
  output.innerHTML = protect(inp.value);
});
