const tbl=document.querySelector("#tbl");
const btn=document.querySelector(".btn");


// adding colum
const colum=()=>{
    let col="";
    for(let i=1;i<=3;i++){
        col+=`<td> new cell${i}</td>`;
    }
    return col;
};
btn.addEventListener('click',()=>{
    let row=document.createElement('tr');
     row.innerHTML=colum();
    console.log(row); 
tbl.appendChild(row);
});