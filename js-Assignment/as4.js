const btn =document.querySelector('.Fbtn');
const item =document.querySelector('#fruits');
const list =document.querySelector('#list');
let Flist=[];
btn.addEventListener('click',()=>{
const select=item.value;
if(!Flist.includes(select)){
    Flist.push(select);
    rendering();
}
});
const rendering=()=>{
    list.innerHTML=Flist.map((i)=>`<li>${i}</li>`).join('');
};
