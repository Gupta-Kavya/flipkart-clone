import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faUser,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import "../App.css";
import { useCart } from "../components/useCart";

const Navbar = () => {
  const { cartcount } = useCart();
  return (
    <>
      <header className="text-gray-400 bg-white body-font">
        <div className="container mx-auto flex flex-wrap p-3 flex-col md:flex-row items-center">
          <a
            className="flex title-font font-medium items-center text-white mb-4 md:mb-0"
            href="http://localhost:3000/"
          >
            <img
              src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fkheaderlogo_exploreplus-44005d.svg"
              className="w-50"
            />
          </a>
          <nav className="md:ml-8 md:py-1 flex flex-auto text-base w-100">
            <input
              type="text"
              id="search-navbar"
              className="block w-full p-2 text-gray-900 border-gray-300 rounded-md bg-blue-50 dark:placeholder-gray-400 dark:text-white nav-search"
              placeholder="Search for Products, Brand and More"
            />
          </nav>
          <a href={"http://localhost:3000/login"}>
            <button
              type="button"
              className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 ml-7"
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" />

              {localStorage.getItem("auth_token") && "My Account"}
              {!localStorage.getItem("auth_token") && "Login"}
            </button>
          </a>
          <button
            type="button"
            className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 ml-7"
            onClick={(e) => {
              window.location = "http://localhost:3000/viewCart";
            }}
          >
            <FontAwesomeIcon icon={faCartShopping} className="mr-2" />
            Cart
            <span className="ml-2 h-5 w-5 text-sm rounded-full bg-blue-600 text-white flex justify-center items-center items">
              <span>{cartcount}</span>
            </span>
          </button>

          <button
            type="button"
            className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 ml-7"
          >
            <FontAwesomeIcon icon={faPhone} className="mr-2" />
            Contact Us
          </button>
        </div>
      </header>
    </>
  );
};

export default Navbar;
