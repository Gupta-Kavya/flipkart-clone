import React, { useState, useEffect } from "react";
import "../Product.css";
import {
  faCartShopping,
  faThunderstorm,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SecondaryCategoryBar from "../components/SecondaryCategoryBar";
import { useCart } from "../components/useCart";
import { toast, Bounce } from "react-toastify";
import { useParams } from "react-router-dom";

const Product = () => {
  const [Pincode, setPincode] = useState();
  const [Service, setService] = useState();
  const [product, setProduct] = useState([]);
  const [productImage, setproductIimage] = useState({
    currentImg: "",
    isActive: "active",
    index: 0,
  });

  let { id } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `http://localhost:3001/fetchProductById/${id}`;
        let products = await fetch(url);
        let productJson = await products.json();

        let pdarr = productJson.Product;

        // Set the product data
        setProduct(pdarr);

        // Set product images in productImgarr
        const productImgarr = pdarr.productImages.map((productImage) => ({
          product_image: productImage,
        }));

        // Set the default product image
        setproductIimage({
          currentImg: productImgarr[0].product_image,
          isActive: "active",
          index: 0,
        });
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
    fetchFilters();
  }, []);

  const productImageManager = (index) => {
    if (product.productImages && product.productImages[index]) {
      setproductIimage({
        currentImg: product.productImages[index],
        isActive: "active",
        index: index,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch_pincodes();
  };

  const fetch_pincodes = async () => {
    try {
      let pins = await fetch("http://localhost:3001/pincodes", {
        mode: "cors",
      });

      let pinJson = await pins.json();

      const int_pin = parseInt(Pincode);

      if (pinJson.includes(int_pin)) {
        // setService(true);

        toast.success("Yay! This pincode is servicable", {
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
        // setService(false);

        toast.warn("This pincode is not servicable", {
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
    } catch (error) {
      console.log({ msg: "failed", error });
    }
  };

  const onChangePincode = (e) => {
    setPincode(e.target.value);
  };

  const { addToCart, enableButton } = useCart();

  const [Filters, setFilters] = useState([]);
  let { pid } = useParams();
  const fetchFilters = async () => {
    try {
      // Check if product has been fetched and has productId property

      let url = `http://localhost:3001/fetchProductFilters/${pid}`;
      let filters = await fetch(url);
      let filterJson = await filters.json();

      // Set the product data
      setFilters(filterJson);
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  let fltr_color;
  let filter_keys_for_auth =
    Filters.Products && Object.keys(Filters.Products).length;
  let product_title_for_cart = `${product.productTitle + " "}(${
    product.productVariant &&
    product.productVariant.Colour + ", " + product.productVariant.Storage
  })`;
  return (
    <>
      <SecondaryCategoryBar />

      {(product[0] === false || filter_keys_for_auth === 0) && (
        <div
          className="bg-white w-100 m-4 rounded-sm p-10"
          style={{ border: "1px solid #E5E4E2" }}
        >
          <center>
            <img
              src="https://img1a.flixcart.com/www/linchpin/fk-cp-zion/img/error-500_f9bbb4.png"
              className="empty-cart-img"
              style={{ width: "40vh" }}
            />
            <div className="empty-cart-title font-semibold text-md mt-4">
              Unfortunately the page you are looking for has been moved or
              deleted
            </div>
          </center>
        </div>
      )}

      {product[0] !== false && filter_keys_for_auth > 0 && (
        <>
          <div className="product flex bg-white mt-1">
            <div className="h-3/4 border-gray-900">
              <div className="product-image-gallery">
                <div className="flex">
                  <div className="product-thumbnails my-1">
                    {product.productImages &&
                      product.productImages.map((imguRL, index) => {
                        return (
                          <img
                            src={imguRL}
                            className={`w-16 ${
                              index === productImage.index ? "active" : ""
                            }`}
                            id="pd-thumb"
                            alt="Product"
                            key={index}
                            onClick={() => {
                              productImageManager(index);
                            }}
                            onMouseOver={() => {
                              productImageManager(index);
                            }}
                          />
                        );
                      })}
                  </div>
                  <div className="product-main-image">
                    <img src={productImage.currentImg} className="w-full" />
                  </div>
                </div>
              </div>

              {product.availableQty > 0 && (
                <div className="fnc-btns m-2">
                  <button
                    className="add-to-cart"
                    onClick={(e) =>
                      addToCart(
                        product._id,
                        product_title_for_cart,
                        product.productActualPrice,
                        product.productSalePrice,
                        1,
                        product.productVariant
                          ? product.productVariant.Colour
                          : "",
                        product.productImages[0]
                      )
                    }
                    disabled={enableButton}
                  >
                    <FontAwesomeIcon icon={faCartShopping} className="mr-3" />
                    ADD TO CART
                  </button>
                  <button className="buy-now">
                    <FontAwesomeIcon icon={faThunderstorm} className="mr-3" />
                    BUY NOW
                  </button>
                </div>
              )}
            </div>

            <div className="product-data m-4">
              <div className="product-title text-xl font-semibold flex justify-between">
                {product.productTitle} (
                {product.productVariant &&
                  product.productVariant.Colour +
                    ", " +
                    product.productVariant.Storage}
                )
                <img
                  src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png"
                  style={{ width: "120px" }}
                />
              </div>

              {product.availableQty > 0 ? (
                <div className="product-price mt-4 flex items-center">
                  <div className="product-actual-price text-3xl font-normal">
                    ₹{product.productSalePrice}
                  </div>
                  <div className="product-sale-price ml-3 text-gray-500">
                    <s>₹{product.productActualPrice}</s>
                  </div>
                  <div className="product-price-discount ml-3 text-green-700 font-normal">
                    {Math.round(
                      100 -
                        (product.productSalePrice * 100) /
                          product.productActualPrice
                    )}
                    % off
                  </div>
                </div>
              ) : (
                <div className="product-sold-out text-4xl font-normal my-3">
                  Sold Out
                </div>
              )}

              <div className="product-offers mt-4">
                <span className="font-bold text-sm">Available Offers : </span>

                <ul className="mt-2 text-sm">
                  {product.productOffers &&
                    product.productOffers.map((offers, index) => (
                      <li key={index}>{offers}</li>
                    ))}
                </ul>
              </div>

              <div className="delivery-pincode mt-4 flex">
                <form onSubmit={handleSubmit}>
                  <span className="font-bold text-sm">Delivery : </span>

                  <input
                    type="text"
                    placeholder="Enter Delivery Pincode"
                    value={Pincode}
                    onChange={onChangePincode}
                    maxLength={6}
                  />
                  <input
                    type="submit"
                    className="text-blue-500 text-md font-bold cursor-pointer"
                    value={"Check"}
                  />

                  {Service && Service != null && (
                    <div className="succ-msg text-sm font-semibold text-green-600 mt-2">
                      Yay! This pincode is servicable
                    </div>
                  )}

                  {!Service && Service != null && (
                    <div className="err-msg text-sm font-semibold text-red-600 mt-2">
                      Currently! This pincode is not servicable
                    </div>
                  )}
                </form>
              </div>

              <div className="product-variant mt-4">
                <div className="product-colour-title">
                  <span className="font-bold text-sm">Colour : </span>
                  <span className="text-sm font-semibold text-gray-500 ml-2">
                    {product.productVariant
                      ? product.productVariant.Colour
                      : ""}
                  </span>
                </div>
              </div>

              <div className="product-variant mt-4">
                <div className="product-colour-title">
                  <span className="font-bold text-sm">Storage : </span>
                  <span className="text-sm font-semibold text-gray-500 ml-2">
                    {product.productVariant
                      ? product.productVariant.Storage
                      : ""}
                  </span>
                </div>
              </div>

              <div className="product-colour-variants flex mt-3">
                {Filters.Products &&
                  Object.keys(Filters.Products).map((productt, index) => {
                    const productVariants = Filters.Products[productt];
                    // console.log(Filters.Products)
                    // Display only one image per color
                    fltr_color = productt;
                    const imageUrl =
                      productVariants[Object.keys(productVariants)[0]].image;
                    const color =
                      product.productVariant != null
                        ? product.productVariant.Colour
                        : "";

                    return (
                      <a
                        href={`http://localhost:3000/product/${
                          productVariants[Object.keys(productVariants)[0]].id
                        }/${pid}`}
                      >
                        <img
                          src={imageUrl}
                          alt={`Product - ${fltr_color}`}
                          className={productt === color ? "active" : ""}
                        />
                      </a>
                    );
                  })}
              </div>

              <div className="product-storage-variants flex mt-3">
                {Filters.Products &&
                  Object.keys(Filters.Products).map((color, index) => {
                    const current_color =
                      product.productVariant != null
                        ? product.productVariant.Colour
                        : "";
                    if (color === current_color) {
                      // Log the storage variants for the target color
                      return Object.keys(Filters.Products[color]).map(
                        (storage) => (
                          <a
                            href={`http://localhost:3000/product/${Filters.Products[color][storage].id}/${pid}`}
                          >
                            <button
                              className={`text-gray-900 bg-white hover:bg-gray-100 border border-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 ${
                                product.productVariant.Storage === storage
                                  ? "active"
                                  : ""
                              }`}
                            >
                              {storage}
                            </button>
                          </a>
                        )
                      );
                    }

                    return null; // Skip rendering for other colors
                  })}
              </div>
              {/* 
  <div className="product-description mt-4">
    <p className="font-bold text-sm">Product Desctiption :</p>
    <p className="text-justify mt-2">{product.productDescription}</p>
  </div> */}

              <div className="product-highlights mt-4">
                <p className="font-bold text-sm">Product Highlights :</p>

                <ul className="mt-2 list-disc ml-6">
                  {product.productHighlights &&
                    product.productHighlights.map((highlights, index) => {
                      return (
                        <li key={index} className="text-sm">
                          {highlights}
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Product;
