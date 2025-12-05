
let products = [
  { id: "1", item: "Shirt" },
  { id: "2", item: "Jeans" },
  { id: "3", item: "T-shirt" },
  { id: "4", item: "Denim Jacket" },
  { id: "5", item: "Casual Shoes" },
];

const list= document.querySelector(".list");

let rendering=()=>{
    list.innerHTML ='';

    products.forEach((product) => {
        const li= document.createElement('li');
        li.textContent=product.item+" ";
        const  btn=document.createElement("button");
        btn.textContent="Remove";

        btn.onclick=()=>{
            products=products.filter((p)=>p.id !== product.id);
            rendering();
        };
        li.appendChild(btn);
        list.appendChild(li);
    });
}
rendering();