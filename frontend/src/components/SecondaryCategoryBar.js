import React from "react";
import "../App.css";
import { Link } from "react-router-dom";

const SecondaryCategoryBar = () => {
  return (
    <>
      <div className="bg-white flex justify-around p-3 font-semibold sec-category-bar">
        <div className="cat cursor-pointer">Grocery</div>
        <Link to={"http://localhost:3000/mobiles"}>
          <div className="cat cursor-pointer">Mobiles</div>
        </Link>
        <div className="cat cursor-pointer">Fashion</div>
        <div className="cat cursor-pointer">Electronics</div>
        <div className="cat cursor-pointer">Home & Furniture</div>
        <div className="cat cursor-pointer">Appliances</div>
        <div className="cat cursor-pointer">Travel</div>
        <div className="cat cursor-pointer">Beauty, Toys & More</div>
        <div className="cat cursor-pointer">Two Wheelers</div>
      </div>
    </>
  );
};

export default SecondaryCategoryBar;
