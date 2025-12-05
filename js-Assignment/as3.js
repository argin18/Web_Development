const clothingStock = [
  {
    id: "1",
    color: "red",
    category: "men shirt",
    item: "Regular Fit Men Shirt",
    inStock: true,
  },
  {
    id: "2",
    color: "green",
    category: "women shirt",
    item: "Slim Fit Women Shirt",
    inStock: true,
  },
  {
    id: "3",
    color: "blue",
    category: "men shirt",
    item: "Oversized Men Shirt",
    inStock: false,
  },
  {
    id: "4",
    color: "yellow",
    category: "men tshirt",
    item: "Regular Fit Men Tshirt",
    inStock: false,
  },
  {
    id: "5",
    color: "magenta",
    category: "women jeans",
    item: "Ankle Lenght Women Jeans",
    inStock: true,
  },
  {
    id: "6",
    color: "yellow",
    category: "men shirt",
    item: "Casual Fit Men Shirt",
    inStock: true,
  },
  {
    id: "7",
    color: "green",
    category: "men jeans",
    item: "Carrot Fit Men Jeans",
    inStock: true,
  },
  {
    id: "8",
    color: "red",
    category: "women shirt",
    item: "Casual Fit Women Shirt",
    inStock: false,
  },
];

const btn1 = document.querySelector("#btn1");
const btn2 = document.querySelector("#btn2");
const btn3 = document.querySelector("#btn3");
const output = document.querySelector(".output");
// women's shirt available
btn1.addEventListener("click", () => {
  const cloth = clothingStock
    .filter((p) => p.category === "women shirt" && p.inStock === true)
    .map((item) => item.color);

  output.innerHTML = `<p>Available colors for women's shirts: ${cloth.join(
    ", "
  )}</p>`;
});

// men's shirt available
btn2.addEventListener("click", () => {
  const cloth = clothingStock
    .filter((p) => p.category === "men shirt" && p.inStock === true)
    .map((item) => item.color);

  output.innerHTML = `<p>Available colors for women's shirts: ${cloth.join(
    ", "
  )}</p>`;
});
//Stock available
btn3.addEventListener("click", () => {
  const cloth = clothingStock.filter((p) => p.inStock === true);

  output.innerHTML = cloth
    .map((i) => `<p>${i.item} (${i.color}) </p>`)
    .join("");
});
