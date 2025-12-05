const inp = document.querySelector("#inp");
const btn = document.querySelector("#btn");
const output = document.querySelector("#output");

inp.addEventListener("input", () => {
  output.textContent = inp.value;
});

btn.addEventListener("click", () => {
  const reversed = inp.value.split("").reverse().join("");
  output.textContent = reversed;
});
