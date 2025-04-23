"use client"

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Lilita_One } from "next/font/google";
import sample1 from "@/assets/sample1.png";
import sample2 from "@/assets/sample2.png";

const lilita_one = Lilita_One({
  weight: '400',
  subsets: ['latin'],
  preload: true,
})


export default function Home() {
  return (
    <main className="main">
      <section className="hero">
        <div className="hero-text-container">
          <div className={`${lilita_one.className} hero-title`}>
            <h1>Snap.</h1>
            <h1>Style.</h1>
            <h1>Share.</h1>
          </div>

          <div className="hero-subhead">
            <p>Online Photo Booth</p>
          </div>

          <div className="hero-description">
            <p>Create adorable photo strips in just seconds. Add cute  stickers, customize with frames, and export in one click. All online,  all FREE, all fun!</p>
          </div>

          <button className="hero-cta">
            <Link href="/photobooth">Get Started!</Link>
          </button>
        </div>

        <div className="hero-card-container">
          <div className="hero-card">
            <Image 
              src={sample2} 
              priority
              alt="" 
              className="hero-card-image-2"
              placeholder="blur" 
              objectFit="cover" 
            /> 
          </div>
          <div className="hero-card">
            <Image 
              src={sample1} 
              priority
              alt="" 
              className="hero-card-image-1"
              placeholder="blur" 
              objectFit="cover"
            /> 
          </div>

        </div>
      </section>
    </main>
  );
}
