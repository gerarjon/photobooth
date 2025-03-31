"use client"

import React from "react";
import Head from "next/head";
import Photobooth from "../components/Photobooth"

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Photo Booth</title>
        <meta name="description" content="Photo Booth | Free Online" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main className="main">
        <h1>Photo Booth</h1>
        <Photobooth />
      </main>
    </div>
  );
}
