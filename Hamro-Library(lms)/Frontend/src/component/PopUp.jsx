import { X } from "lucide-react";
import React from "react";

const PopUp = ({ title, children, onclose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] md:w-125 rounded-xl shadow-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={onclose}
          className="absolute top-3 cursor-pointer active:scale-90  right-3 text-gray-500 hover:text-red-500"
        >
          <X />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        {/* Content */}
        <div>{children}</div>
        
      </div>
    </div>
  );
};

export default PopUp;
