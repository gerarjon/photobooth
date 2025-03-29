"use client"

import React, {useState} from "react";
import Head from "next/head";
import Photobooth from "../components/Photobooth"
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Next.js Photo Booth</title>
        <meta name="description" content="A photo booth app built with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h1 className="title">Next.js Photo Booth</h1>
        <Photobooth />
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .main {
          padding: 3rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 800px;
        }

        .title {
          margin: 0 0 2rem;
          line-height: 1.15;
          font-size: 2.5rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
