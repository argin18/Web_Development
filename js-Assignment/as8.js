const inp=document.querySelector('input');
const btn=document.querySelector('.btn');
const output=document.querySelector('.out');

// remove space
const rSpace=(str)=>{
    let remove="";
    for(let i=0;i<str.length;i++){
        if(str[i]===" "){
             continue;
        }else{
            remove+=str[i];
        }
    }
    return remove;
};
// rSpace("sjjhdjsdhello   hoehbd  sjdsdjbbd");

btn.addEventListener('click',()=>{
output.innerHTML=rSpace(inp.value);
});