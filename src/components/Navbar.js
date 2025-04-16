/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingDown = currentScrollPos > prevScrollPos;
      setVisible(!isScrollingDown);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);



  return (
    <nav className={`navbar ${visible ? "navbar-visible" : "navbar-hidden"}`}>
      <div className="logo-container">
          <Link href="/">
            <img 
              src="/assets/logo2.png"
              alt="Logo" 
              fill="true"
              style={{
                display: "block",
                objectFit: "cover",
                height: "100%",
                width: "100%",
                objectPosition: "center center",
              }}
            />
          </Link>
      </div>
    </nav>
  )
}

export default Navbar;
