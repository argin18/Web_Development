import React from "react";

const Card = ({ title, value, color,...rest }) => {
  return (
    <>
    {/* This is a pop up card component used to show pop up messages */}
      <div {...rest} className="bg-white p-5 cursor-pointer rounded-lg shadow">
        <h4 className="text-gray-600 font-medium">{title}</h4>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </div>
    </>
  );
};

export default Card;
