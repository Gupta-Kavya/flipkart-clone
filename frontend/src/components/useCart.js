import { useState, useEffect } from "react";
import { toast, Bounce } from "react-toastify";
const CryptoJS = require("crypto-js");

export const useCart = () => {
  const [cart, setCart] = useState({});
  const [subtotal, setSubtotal] = useState(0);
  const [cartcount, setCartcount] = useState(0);
  const [enableButton, setenableButton] = useState(false);
  const [Price, setPrice] = useState(0);
  const [Discount, setDiscount] = useState(0);

  useEffect(() => {
    try {
      if (
        localStorage.getItem("cart") &&
        localStorage.getItem("cart_count") &&
        localStorage.getItem("subtotal") &&
        localStorage.getItem("price") &&
        localStorage.getItem("discount")
      ) {
        setCart(JSON.parse(localStorage.getItem("cart")));

        setCartcount(JSON.parse(localStorage.getItem("cart_count")));
        setSubtotal(JSON.parse(localStorage.getItem("subtotal")));
        setPrice(JSON.parse(localStorage.getItem("price")));
        setDiscount(JSON.parse(localStorage.getItem("discount")));
      }
    } catch (error) {
      console.log(error);
      localStorage.clear();
    }
  }, []);

  const saveCart = async (cart, count, itemCode) => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("cart_count", JSON.stringify(count));
    let total_discount = 0;
    let keys_used_for_discount = Object.keys(cart);
    let total_price = 0;
    // Check if the item with the specified itemCode exists in the cart
    if (itemCode && cart[itemCode]) {
      for (let i = 0; i < keys_used_for_discount.length; i++) {
        total_discount +=
          cart[keys_used_for_discount[i]].itemActualPrice *
            cart[keys_used_for_discount[i]].itemQty -
          cart[keys_used_for_discount[i]].itemSalePrice *
            cart[keys_used_for_discount[i]].itemQty;

        total_price +=
          cart[keys_used_for_discount[i]].itemActualPrice *
          cart[keys_used_for_discount[i]].itemQty;
      }

      localStorage.setItem("price", total_price);
      localStorage.setItem("discount", total_discount);
    } else {
      // Handle the case where the item has been deleted
      // localStorage.removeItem("price");
      // localStorage.removeItem("discount");
    }

    let subt = 0;
    let keys = Object.keys(cart);

    for (let i = 0; i < keys.length; i++) {
      subt += cart[keys[i]].itemSalePrice * cart[keys[i]].itemQty;
    }
    setSubtotal(subt);
    localStorage.setItem("subtotal", subt);
  
    const cart_token = CryptoJS.AES.encrypt(subt.toString(), "secret").toString();
    localStorage.setItem("cart_token", cart_token);


    setTimeout(() => {
      window.location = "http://localhost:3000/viewCart";
    }, 1000);
  };

  const addToCart = (
    itemCode,
    itemTitle,
    itemActualPrice,
    itemSalePrice,
    itemQty,
    itemColour,
    itemImage
  ) => {
    let newCart = { ...cart };
    if (itemCode in cart) {
      newCart[itemCode].itemQty = cart[itemCode].itemQty + itemQty;
      setenableButton(false);

      setCartcount((prevCount) => prevCount + 1);

      toast.success("Cart Successfully Updated", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    } else {
      newCart[itemCode] = {
        itemCode,
        itemTitle,
        itemActualPrice,
        itemSalePrice,
        itemQty,
        itemColour,
        itemImage,
      };

      toast.success("Product Successfully Added", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });

      setCartcount((prevCount) => prevCount + 1);
    }
    setenableButton(true);
    saveCart(newCart, cartcount + 1, itemCode);
    setCart(newCart);
  };

  let newCart = { ...cart };

  const removeFromcart = (
    itemCode,
    itemTitle,
    itemActualPrice,
    itemSalePrice,
    itemQty,
    itemColour,
    itemImage
  ) => {
    if (itemCode in cart) {
      newCart[itemCode].itemQty = cart[itemCode].itemQty - itemQty;
      setenableButton(false);
      toast.success("Cart Successfully Updated", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }

    if (newCart[itemCode].itemQty <= 0) {
      delete newCart[itemCode];
    }

    let total_discount = 0;
    let total_price = 0;

    // Recalculate total_discount and total_price for the updated cart
    let keys_used_for_discount = Object.keys(newCart);
    for (let i = 0; i < keys_used_for_discount.length; i++) {
      total_discount +=
        newCart[keys_used_for_discount[i]].itemActualPrice *
          newCart[keys_used_for_discount[i]].itemQty -
        newCart[keys_used_for_discount[i]].itemSalePrice *
          newCart[keys_used_for_discount[i]].itemQty;

      total_price +=
        newCart[keys_used_for_discount[i]].itemActualPrice *
        newCart[keys_used_for_discount[i]].itemQty;
    }

    localStorage.setItem("price", total_price);
    localStorage.setItem("discount", total_discount);

    setCartcount((prevCount) => prevCount - 1); // Decrease cartcount by 1
    saveCart(newCart, cartcount - 1, itemCode); // Decrease cartcount in saveCart
    setCart(newCart);
    setenableButton(true);
  };

  const clearCart = () => {
    setCart({});
    setCartcount(0);
    saveCart({}, 0, 0);
    setSubtotal(0);
    localStorage.setItem("price", 0);
    localStorage.setItem("discount", 0);
    localStorage.removeItem("cart_token");

    toast.success("Cart Successfully Cleared", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };

  const deleteProduct = (itemCode, itemQty) => {
    if (itemCode in cart) {
      delete newCart[itemCode];

      toast.success("Product Successfully Removed", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }

    let total_discount = 0;
    let total_price = 0;

    // Recalculate total_discount and total_price for the updated cart
    let keys_used_for_discount = Object.keys(newCart);
    for (let i = 0; i < keys_used_for_discount.length; i++) {
      total_discount +=
        newCart[keys_used_for_discount[i]].itemActualPrice *
          newCart[keys_used_for_discount[i]].itemQty -
        newCart[keys_used_for_discount[i]].itemSalePrice *
          newCart[keys_used_for_discount[i]].itemQty;

      total_price +=
        newCart[keys_used_for_discount[i]].itemActualPrice *
        newCart[keys_used_for_discount[i]].itemQty;
    }

    localStorage.setItem("price", total_price);
    localStorage.setItem("discount", total_discount);

    setCartcount((prevCount) => prevCount - itemQty); // Decrease cartcount by the deleted itemQty
    saveCart(newCart, cartcount - itemQty, itemCode); // Decrease cartcount in saveCart
    setCart(newCart);
  };

  return {
    cart,
    addToCart,
    removeFromcart,
    clearCart,
    cartcount,
    deleteProduct,
    enableButton,
    subtotal,
    Price,
    Discount,
  };
};
