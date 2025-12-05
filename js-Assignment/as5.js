const inp=document.querySelector('#inp');
const btn=document.querySelector('.btn');
const output=document.querySelector('.outp');
// selecting only more than 5 charecter words
const checkWord=(str)=>{
    const word=str.split(" ");
    let w="";
    word.forEach(words => {
        
        if(words.length>5){
    //    let color= document.writeln(words);
     w+= `<span class="highlight"> ${words}</span> `;  
}else{
    w+= words+" ";
}

});
output.innerHTML=w;
};

btn.addEventListener('click',()=>{
   checkWord(inp.value);
});