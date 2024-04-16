import React, { useEffect, useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import SecondaryCategorySection from "../components/SecondaryCategoryBar";

const Mobiles = () => {
  const [productArr, setProductArr] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      let url = `${process.env.REACT_APP_API_DOMAIN}/fetchProducts`;
      let products = await fetch(url);
      let productJson = await products.json();
      setProductArr(productJson.Products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  return (
    <>
      <SecondaryCategorySection />
      <div className="product-section">
        <div className="filters"></div>

        <div className="products">
          {productArr.map((product, index) => {
            return (
              <Link
                to={`${process.env.REACT_APP_FRONT_DOMAIN}/product/${product._id}/${product.productId}`}
              >
                <div className="product-mobiles flex">
                  <div className="item-image w-96">
                    <img src={product.productImages[0]} />
                  </div>

                  <div className="item-short-details">
                    <h3 className="item-title">
                      {" "}
                      {product.productTitle} (
                      {product.productVariant &&
                        product.productVariant.Colour +
                          ", " +
                          product.productVariant.Storage}
                      )
                    </h3>
                    <ul className="text-sm mt-4">
                      {product.productHighlights.map((highlights, index) => {
                        return <li>{highlights}</li>;
                      })}
                    </ul>
                  </div>

                  <div className="sale-price mt-2">
                    <h2>₹ {product.productSalePrice}</h2>
                    <p className="actual-price text-sm text-gray-500 mt-1">
                      <s>₹{product.productActualPrice}</s>
                      <span className="percent-off text-sm text-green-600 ml-2 font-semibold">
                        10% off
                      </span>
                    </p>
                    <img
                      src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png"
                      className="w-20 mt-3 ml-2"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Mobiles;
