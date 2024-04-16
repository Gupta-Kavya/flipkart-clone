import React from "react";
import "../App.css";
import SecondaryCategoryBar from "../components/SecondaryCategoryBar";
import { useCart } from "../components/useCart";



const Cart = () => {
  const {
    cart,
    addToCart,
    removeFromcart,
    clearCart,
    deleteProduct,
    enableButton,
    subtotal,
    cartcount,
    Price,
    Discount,
  } = useCart();


  return (
    <>
      <SecondaryCategoryBar />

      {Object.keys(cart).length === 0 && (
        <div
          className="bg-white w-100 m-4 rounded-sm p-10"
          style={{ border: "1px solid #E5E4E2" }}
        >
          <center>
            <img
              src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90"
              className="empty-cart-img"
              style={{ width: "40vh" }}
            />
            <div className="empty-cart-title font-semibold text-md mt-4">
              Your cart is Empty! Please add Products to it.
            </div>
          </center>
        </div>
      )}

      {Object.keys(cart).length > 0 && (
        <div className="cart-page flex mt-6 ml-10 mr-10">
          <div
            className="cart bg-white w-3/4 mr-4 rounded-sm"
            style={{ border: "1px solid #E5E4E2" }}
          >
            {Object.keys(cart).map((k) => {
              return (
                <div key={k}>
                  <div className="cart-product flex p-10 justify-between items-stretch">
                    <div className="product_image">
                      <img src={cart[k].itemImage} className="w-20" />
                    </div>

                    <div className="product-details">
                      <div className="product-title ml-4 flex">
                        {cart[k].itemTitle}
                        <div className="product-delivery-date ml-4 text-md">
                          Delivery in 2 days, Mon
                        </div>
                      </div>
                      <div className="product-color ml-4 text-sm">
                        Colour : {cart[k].itemColour}
                      </div>
                      <div className="product-price ml-4 flex mt-5 items-center">
                        <div className="sale-price text-sm text-gray-500">
                          <s>₹{cart[k].itemActualPrice}</s>
                        </div>
                        <div className="actual-price ml-3 font-normal text-3xl">
                          ₹{cart[k].itemSalePrice}
                        </div>
                        <div className="product-price-discount ml-3 text-green-700 font-normal">
                          {100 -
                            Math.round(
                              (100 * cart[k].itemSalePrice) /
                                cart[k].itemActualPrice
                            )}
                          % off
                        </div>
                      </div>

                      <div className="cart_functions flex items-baseline align-middle mt-5">
                        <form id="quantity-selector" className="ml-4">
                          <input
                            type="button"
                            value="-"
                            id="qtyminus minus"
                            field="quantity"
                            onClick={(e) =>
                              removeFromcart(
                                cart[k].itemCode,
                                cart[k].itemTitle,
                                cart[k].itemActualPrice,
                                cart[k].itemSalePrice,
                                1,
                                cart[k].itemColour
                              )
                            }
                            disabled={enableButton}
                            className="cursor-pointer"
                          />
                          <input
                            type="text"
                            name="quantity"
                            value={`${cart[k].itemQty}`}
                            className="qty"
                            disabled
                          />
                          <input
                            type="button"
                            value="+"
                            id="qtyplus plus"
                            field="quantity"
                            onClick={(e) =>
                              addToCart(
                                cart[k].itemCode,
                                cart[k].itemTitle,
                                cart[k].itemActualPrice,
                                cart[k].itemSalePrice,
                                1,
                                cart[k].itemColour
                              )
                            }
                            disabled={enableButton}
                            className="cursor-pointer"
                          />
                        </form>
                        <button
                          disabled={enableButton}
                          className="ml-5 text-md font-semibold"
                          onClick={(e) =>
                            deleteProduct(cart[k].itemCode, cart[k].itemQty)
                          }
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>
              );
            })}

            <div className="clear-cart-button m-4">
              <button className="clear-cart" onClick={clearCart}>
                CLEAR CART
              </button>
            </div>
          </div>
          <div className="cart-total bg-white w-2/6 h-1/2">
            <div className="heading m-5 text-gray-400 font-semibold">
              PRICE DETAILS
            </div>
            <hr />

            <div className="price-distribution m-5">
              <table className="cart-price-table w-full table-auto my-3">
                <tbody>
                  <tr>
                    <td>Price ({cartcount} item)</td>

                    <td style={{ float: "right" }}>₹{Price}</td>
                  </tr>
                  <tr>
                    <td>Discount</td>

                    <td className="text-green-600" style={{ float: "right" }}>
                      − ₹{Discount}
                    </td>
                  </tr>
                  <tr>
                    <td>Delivery Charges</td>
                    <td style={{ float: "right" }}>Free</td>
                  </tr>
                </tbody>
              </table>
              <hr />
            </div>
            <div className="total-amount flex m-5 justify-between">
              <div className="heading text-black-400 font-semibold text-lg">
                Total Amount
              </div>
              <div className="total-amount-figure text-lg">₹{subtotal}</div>
            </div>
            <hr />
            <div className="succ-msg text-sm font-semibold text-green-600 m-5">
              <div>
                You will save ₹{Discount + " "}
                on this order
              </div>
            </div>

            <div className="place-order-button m-5">
              <a href={process.env.REACT_APP_FRONT_DOMAIN + "/checkOut"} ><button className="place-order">
                CHECKOUT
              </button></a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
