"use client"

import React from "react";
import Link from "next/link";
import { Lilita_One } from "next/font/google";

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

          <div className="hero-description">
            <p>Create adorable photo strips in just seconds. Add cute  stickers, customize with frames, and export in one click. All online,  all FREE, all fun!</p>
          </div>

          <button className="hero-cta">
            <Link href="/photobooth">Get Started!</Link>
          </button>
        </div>
        <div className="hero-images">

        </div>
      </section>
    </main>
  );
}
