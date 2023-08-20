import React from 'react';
import {ReactNavbar} from 'overlay-navbar';
import logo from './logo.png';

const Header = () => {
    const options = {
        burgerColor: 'rgba(8, 142, 252, 0.829)',
        burgerColorHover: "rgba(0, 70, 128, 0.829)",
        logo,
        logoWidth: "20rem",
        navColor1: "rgb(250, 250, 250)",
        logoHoverSize: "10px",
        logoHoverColor: 'rgba(8, 142, 252, 0.829)',
        link1Text: "Home",
        link2Text: "About",
        link3Text: "Contact",
        link4Text: "Drawing",
        link1Url: "/",
        link2Url: "/about",
        link3Url: "/contact",
        link4Url: "/drawing",
        link1Size: "2.5rem",
        link1Color: "rgba(35, 35, 35,0.8)",
        nav1justifyContent: "flex-end",
        nav2justifyContent: "flex-end",
        nav3justifyContent: "flex-start",
        nav4justifyContent: "flex-start",
        link1ColorHover: "rgba(8, 142, 252, 0.829)",
        link1Margin: "1.5rem"
      };
  return (
    <ReactNavbar {...options}/>
  )
}

export default Header