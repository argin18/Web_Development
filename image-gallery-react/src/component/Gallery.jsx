import axios from "axios";
import React, { useEffect, useState } from "react";

const Gallery = () => {
  const [userdata, setuserData] = useState([]);
  const [num, setNum] = useState(1);

  const clickBtn = async () => {
    const response = await axios.get(
      `https://picsum.photos/v2/list?page=${num}&limit=28`
    );
    setuserData(response.data);
  };
  console.log(num);

  let print = <h3 className="absolute top-1/2 right-1/2 font-mono text-lg">Loading...</h3>;
  if (userdata.length > 0) {
    print = userdata.map((item, ind) => {
      return (
        <div key={ind} className="">
          <a href={item.url} target="_blank">
            <div className=" rounded-xl overflow-auto  h-44 w-44">
              <img
                className="h-full object-cover"
                src={item.download_url}
                height={40}
                alt=""
              />
            </div>
            <h2 className="text-lg font-bold text-center">{item.author}</h2>
          </a>
        </div>
      );
    });
  }

  useEffect(() => {
    clickBtn();
  }, [num]);

  return (
    <div>
      <div className=" flex justify-end gap-3 my-4 mr-4">
        <button
          onClick={() => {
            if (num > 1) setNum(num - 1);
            setuserData([]);
          }}
        //   style={{opacity:num===1 ? 0.5: 1 }}
          disabled={num === 1}
          className={` ${num === 1 ? "opacity-50 active:scale-100 cursor-not-allowed" : "active:scale-95" } w-20 text-xl font-bold  active:scale-95 text-white bg-blue-500 rounded-xl  h-10`
          }>
          PREV
        </button>
        <h2 className="text-xl font-semibold pt-1 mx-2">Page {num}</h2>
        <button
          onClick={() => {
            setuserData([]);
            setNum(num + 1);
          }}
          className=" w-20 text-xl font-bold active:scale-95 text-white bg-green-500 rounded-xl  h-10"
        >
          NEXT
        </button>
      </div>
      <div className="grid  p-3 grid-cols-2 lg:grid-cols-7 sm:grid-cols-4 gap-3 overflow-auto">{print}</div>
    </div>
  );
};

export default Gallery;
