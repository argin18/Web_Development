import React, { useState } from "react";
import { X } from 'lucide-react';

const Note = () => {
    const [list, setList] = useState([])
    const [title, setTitle] = useState('')
    const [detail, setDetail] = useState('')
    const submitHandle =(e)=>{
        e.preventDefault();
        const newList=[...list];
        if((title.trim() && detail.trim()) ==="") return alert("Input should be Fill up...!")
        newList.push({title,detail})
        setDetail('')
        setTitle('')
        setList(newList)
        console.log("form submit success fully " +title +detail)
        console.log(newList)
    }

    const deletebtn=(ind)=>{
        const copyList=[...list];
        copyList.splice(ind,1)
        setList(copyList)
    }
  return (
    <div className="  gap-1.5 sm:flex ">
      <form onSubmit={(e)=>submitHandle(e)} className=" items-center  sm:w-1/2 flex flex-col gap-1 p-3 ">
        <input
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
          className="outline-none border border-gray-700 w-full h-12 text-2xl rounded-xl p-1"
          type="text"
          placeholder="Enter Title..."
        />
        <textarea
        value={detail}
        onChange={(e)=>setDetail(e.target.value)}
          className="outline-none border w-full  border-gray-700 h-22 text-md rounded-xl p-1"
          name=""
          placeholder="Enter Details.."
          id=""
        ></textarea>
        <button type="submit" className="border-2 active:scale-95 active:text-gray-400 text-white active:bg-green-700 bg-green-600 text-xl rounded-xl w-18 h-10">
          Add
        </button>
      </form>
      <div className=" grid rounded-xl bg-gray-50 lg:w-1/2 sm:w-1/2">
        <h1 className="pl-2 text-4xl mb-2 font-semibold text-c">Recent Notes:</h1>
      <div className="grid rounded-xl bg-gray-50 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 mr-0 p-2">
            {
                list.map((item,ind)=>(
                    <div key={ind} className="lg:h-64 relative border-2 h-52 rounded-xl overflow-auto p-1.5 border-red-900  ">
            <X onClick={()=>deletebtn(ind)} size={30} strokeWidth={3} className=" text-4xl hover:bg-red-400 rounded absolute top-2 right-2 z-10  hover:text-white active:scale-95" />
            <h2 className=" text-2xl font-semibold">{item.title}</h2> 
            <p className="leading-tight ">{item.detail}</p>
        </div>
                ))
            }
      </div>
      </div>
    </div>
  );
};

export default Note;
