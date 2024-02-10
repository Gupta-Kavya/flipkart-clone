import React, { useState } from "react";
import "../App.css";
import SecondaryCategoryBar from "../components/SecondaryCategoryBar";
import { useCart } from "../components/useCart";
import { toast, Bounce } from "react-toastify";
const CryptoJS = require("crypto-js");

const Checkout = () => {
  const { cart, subtotal, cartcount, Price, Discount } = useCart();

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [locality, setLocality] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loader, setLoader] = useState(false);
  const [pincode, setPincode] = useState(false);

  const fetchLocality = async (pincode) => {
    if (pincode.toString().length === 6) {
      const res = await fetch(
        `https://indianpincodes.co.in/api/pincode/${pincode}`,
        {
          headers: {
            Authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozMSwiZ2VuZXJhdGVkX29uIjoiMjAyNC0wMS0yNlQxNDoxODo0Ni4xODIxNjdaIn0.Ae96lrgUEgbLEto8Qv86JTRBqugMlFMP7INslH6napE",
          },
        }
      );

      let resJson = await res.json();

      if (resJson.error) {
        toast.error("Please enter a valid Pincode", {
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
        setCity("");
        setState("");
      } else {
        setPincode(pincode);
        setCity(resJson.city);
        setState(resJson.state);
      }
    } else {
      setCity("");
      setState("");
    }
  };

  let bytes = CryptoJS.AES.decrypt(
    localStorage.getItem("cart_token")
      ? localStorage.getItem("cart_token")
      : "",
    "secret"
  );
  let originalText = bytes.toString(CryptoJS.enc.Utf8);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (
      city === "" ||
      state === "" ||
      name === "" ||
      address === "" ||
      locality === "" ||
      phone === "" ||
      email === "" ||
      pincode === ""
    ) {
      toast.error("Please fill all the required details", {
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
      setLoader(true);
      if (
        localStorage.getItem("subtotal") &&
        localStorage.getItem("subtotal") === originalText
      ) {
        const response = await fetch("http://localhost:3001/createOrder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Add any necessary payload for the order creation
          body: JSON.stringify({ amount: subtotal }),
        });
        const orderData = await response.json(); // Assuming your API returns JSON

        let options = {
          key: "rzp_test_riqhxVytzFMjIp", // Enter the Key ID generated from the Dashboard
          name: "FLIPKART",
          order_id: await orderData.rzpOrder.id, // Use the actual order ID received from your API response
          prefill: {
            name: name,
            email: email,
            contact: phone,
          },
          theme: {
            color: "#3399cc",
          },
          // This handler function will handle the success payment
          handler: async function (res) {
            setLoader(true);
            const response = await fetch(
              "http://localhost:3001/verifyPayment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                // Add any necessary payload for the order creation
                body: JSON.stringify({ payment_id: res.razorpay_payment_id }),
              }
            );

            const resJson = await response.json();

            if (
              resJson.status === "captured" &&
              subtotal * 100 === resJson.amount
            ) {
              localStorage.removeItem("cart");
              localStorage.removeItem("cart_token");
              localStorage.removeItem("subtotal");
              localStorage.removeItem("discount");
              localStorage.removeItem("price");
              localStorage.removeItem("cart_count");
              localStorage.removeItem("price");

              setTimeout(() => {
                setLoader(false);
                toast.success("Yay! Order Placed Successfully", {
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
              }, 1200);

              setTimeout(() => {
                window.location = "http://localhost:3000/order-success";
              }, 1800);

              const orderid = Math.floor(Math.random() * 1000000000000 + 1);

              localStorage.setItem("order_id", orderid);

              await fetch("http://localhost:3001/saveOrder", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                // Add any necessary payload for the order creation
                body: JSON.stringify({
                  userId: localStorage.getItem("auth_token"),
                  orderId: orderid,
                  orderStatus: "Processing",
                  cName: name,
                  cEmail: email,
                  cPincode: pincode,
                  cLocality: locality,
                  cPhone: phone,
                  cAddress: address,
                  cCity: city,
                  cState: state,
                  products: cart,
                  rzpPaymentId: res.razorpay_payment_id,
                  rzpOrderId: res.razorpay_order_id,
                  paymentStatus: resJson.status,
                  subTotal: subtotal,
                  paymentMethod: resJson.method,
                }),
              });
            }
          },
        };

        var rzp1 = new window.Razorpay(options);

        rzp1.open();

        rzp1.on("payment.failed", function (response) {
          setLoader(false);
          toast.error("Payment failed! Please try again.", {
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
          // alert(response.error.code);
          // alert(response.error.description);
          // alert(response.error.source);
          // alert(response.error.step);
          // alert(response.error.reason);
          // alert(response.error.metadata.order_id);
          // alert(response.error.metadata.payment_id);
        });
      } else {
        localStorage.removeItem("cart");
        localStorage.removeItem("subtotal");
        localStorage.removeItem("cart_token");
        localStorage.removeItem("price");
        localStorage.removeItem("cart_count");
        localStorage.removeItem("discount");

        toast.error("Something went wrong !!", {
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

        setTimeout(() => {
          window.location = "http://localhost:3000/viewCart";
        }, 1000);
      }
    }
  };

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
          <div className="checkout-form bg-white w-3/4 mr-4 rounded-sm p-4">
            <div className="text-lg font-bold mb-5">DELIVERY ADDRESS</div>

            <form>
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                  <input
                    type="text"
                    id="first_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Full Name"
                    required
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    id="first_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Email Id"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    id="first_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Pin Code"
                    required
                    onChange={(e) => fetchLocality(e.target.value)}
                    minLength={6}
                    maxLength={6}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    id="first_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Locality"
                    required
                    onChange={(e) => setLocality(e.target.value)}
                    value={locality}
                  />
                </div>
              </div>

              <input
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-6"
                placeholder="Phone No"
                required
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
              />

              <div className="mb-6">
                <textarea
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Address"
                  required
                  style={{ height: "20vh" }}
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                ></textarea>

                <div className="grid gap-6 mb-6 md:grid-cols-2 mt-6">
                  <div>
                    <input
                      type="text"
                      id="first_name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="City / District / Town"
                      required
                      onChange={(e) => setCity(e.target.value)}
                      value={city}
                      disabled
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      id="first_name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="State"
                      required
                      onChange={(e) => setState(e.target.value)}
                      value={state}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </form>
            <hr className="my-4" />
            <div className="text-lg font-bold mb-5">ORDER SUMMARY</div>

            <div
              className="cart bg-white rounded-sm"
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
                      </div>
                    </div>
                    <hr />
                  </div>
                );
              })}
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
              <button className="place-order" onClick={handlePayment}>
                {loader && (
                  <img
                    src="/loading.gif"
                    style={{
                      width: "25px",
                      alignItems: "center",
                      margin: "auto",
                    }}
                  />
                )}

                {!loader && "PLACE ORDER"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;
