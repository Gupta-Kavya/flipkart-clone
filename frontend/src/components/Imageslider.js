import React from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import "../App.css";

const Imageslider = () => {

  const divStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundSize: "cover",
    height: "250px"
    
  };
  const slideImages = [

    {
      url: "https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/8357b70d16dd4a59.jpeg?q=20",
    },
    {
      url: "https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/9021283f0be266c1.jpg?q=20",
    },
    {
      url: "https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/67b53826ce8284e0.jpeg?q=20",
    },
    {
      url: "https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/ca2843e62171405e.jpg?q=20",
    }

    
  ];

  return (
    <>
      <>
        <div className="slide-container">
          <Slide>
            {slideImages.map((slideImage, index) => (
              <div key={index}>
                <div
                  style={{
                    ...divStyle,
                    backgroundImage: `url(${slideImage.url})`,
                  }}
                ></div>
              </div>
            ))}
          </Slide>
        </div>
      </>
    </>
  );
};

export default Imageslider;
