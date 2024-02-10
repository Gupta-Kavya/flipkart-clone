import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Mobiles from "./pages/Mobiles";
import Navbar from "./components/Navbar";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Checkout from "./pages/Checkout";
import Signup from "./pages/Signup";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import LoadingBar from "react-top-loading-bar";
import Order_success from "./pages/Order_success";

const root = ReactDOM.createRoot(document.getElementById("root"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/mobiles",
    element: <Mobiles />,
  },
  {
    path: "/product/:id/:pid",
    element: <Product />,
  },
  {
    path: "/viewCart",
    element: <Cart />,
  },
  {
    path: "/checkOut",
    element: <Checkout />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/order-success",
    element: <Order_success />,
  },
]);

const AppWithCart = () => {
  useEffect(() => {
    setProgress(40);

    setTimeout(() => {
      setProgress(100);
    }, 300);
  }, []);

  const [progress, setProgress] = useState(40);

  return (
    <React.StrictMode>
      <Navbar />
      <LoadingBar
        color="#007aff"
        height = {3}
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <RouterProvider router={router} />
      <ToastContainer />
      {/* <Footer /> */}
    </React.StrictMode>
  );
};

root.render(<AppWithCart />);

reportWebVitals();
