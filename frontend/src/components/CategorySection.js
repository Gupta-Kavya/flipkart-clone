import React from "react";
import "../App.css";
import {Link} from "react-router-dom";

const CategorySection = () => {
  return (
    <>
      <div className="category-section">
        <div className="single-category">
          <img src="/images/categories/grocerry.jpg" />
          <p>Grocery</p>
        </div>

        <div className="single-category">
          <Link to={`mobiles`}>
            <img src="/images/categories/mobiles.jpg" />
            <p>Mobiles</p>
          </Link>
        </div>

        <div className="single-category">
          <img src="/images/categories/fashion.jpg" />
          <p>Fashion</p>
        </div>

        <div className="single-category">
          <img src="/images/categories/electronics.jpg" />
          <p>Electronics</p>
        </div>

        <div className="single-category">
          <img src="/images/categories/furniture.jpg" />
          <p>Home & Furniture</p>
        </div>

        <div className="single-category">
          <img src="/images/categories/appliances.jpg" />
          <p>Appliances</p>
        </div>

        <div className="single-category">
          <img src="/images/categories/travel.jpg" />
          <p>Travel</p>
        </div>

        <div className="single-category">
          <img src="/images/categories/toys.jpg" />
          <p>Beauty, Toys & More</p>
        </div>

        <div className="single-category">
          <img src="/images/categories/two-wheeler.jpg" />
          <p>Two Wheelers</p>
        </div>
      </div>
    </>
  );
};

export default CategorySection;
