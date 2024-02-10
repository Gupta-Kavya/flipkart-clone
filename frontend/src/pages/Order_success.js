import React from "react";
import "../App.css";
import SecondaryCategoryBar from "../components/SecondaryCategoryBar";

const Order_success = () => {
  return (
    <>
      <SecondaryCategoryBar />

      <div
        className="bg-white w-100 m-4 rounded-sm p-10"
        style={{ border: "1px solid #E5E4E2" }}
      >
        <center>
          <img
            src="/check.png"
            className="empty-cart-img"
            style={{ width: "10vh" }}
          />
          <div className="empty-cart-title font-semibold text-md mt-4">
            Yeah!! Your Order has been Successfully placed with Us.
          </div>

          <div className="font-semibold text-sm mt-4">
            Order Id : {localStorage.getItem("order_id")}
          </div>

          <button
            type="button"
            className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mt-4"
          >
           Go to Orders Section
          </button>


        </center>
      </div>
    </>
  );
};

export default Order_success;
