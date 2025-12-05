const numbers = [1, 2, 3, 4, 5, 4, 3, 4, 3, 2, 1, 6, 7, 5];
const btn = document.querySelector(".btn");
const p = document.querySelector(".p");
// selecting most frequency number
const mostRepeated = () => {
  let freq = [];
  for (let i = 0; i < numbers.length; i++) {
    let count = 0;
    for (let j = 0; j < numbers.length; j++) {
      if (numbers[i] === numbers[j]) {
        count++;
      }
    }
    freq.push(count);
  }
//   console.log(freq);
  let mx = Math.max(...freq);
//   console.log(mx);
  let mfre = [];
  for (let i = 0; i < freq.length; i++) {
    if (freq[i] === mx) {
      mfre.push(numbers[i]);
    }
  }
//   console.log(mfre);
  let fin =Math.max(...mfre);
  return fin;
//   console.log(fin);
};

btn.addEventListener("click", () => {
 p.innerHTML= mostRepeated();
});
