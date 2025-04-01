/* eslint-disable @next/next/no-img-element */
"use client"

import { PhotoContext } from "@/context/PhotoState";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from './Photobooth.module.css';


const PhotoStrip = () => {
  const { photos } = useContext(PhotoContext);
  const canvasRef = useRef(null);
  const [backgroundColor, setBackgroundColor] = useState("white");

  const generatePhotostrip = useCallback(() => {
    const canvas  = canvasRef.current;
    if (!canvas || photos.length !== 4) return;
    const context = canvas.getContext("2d");

    const imgWidth = 400;
    const imgHeight = 300;
    const borderSize = 40;
    const photoSpacing = 20;
    const textHeight = 50;
    const totalHeight = (imgHeight * 4) + (photoSpacing * 3) + (borderSize * 2) + textHeight;

    canvas.width = imgWidth + borderSize * 2;
    canvas.height = totalHeight;

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Keep track of images loaded
    let imagesLoaded = 0;
    const totalImages = photos.length;

    photos.forEach((imageSrc, index) => {
      const img = new Image();
      img.src = imageSrc;
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const yOffset = borderSize + (imgHeight + photoSpacing) * index;

        const imageRatio = img.width / img.height;
        const targetRatio = imgWidth / imgHeight;

        let sourceWidth = img.width;
        let sourceHeight = img.height;
        let sourceX = 0;
        let sourceY = 0;

        // Cropping logic (center crop)
        if (imageRatio > targetRatio) {
          // Image is wider than target aspect ratio, crop sides
          sourceWidth = sourceHeight * targetRatio;
          sourceX = (img.width - sourceWidth) / 2;
        } else {
          // Image is taller than target aspect ratio, crop top/bottom
          sourceHeight = sourceWidth / targetRatio;
          sourceY = (img.height - sourceHeight) / 2;
        }

        context.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,
          borderSize, yOffset, imgWidth, imgHeight
        );

        imagesLoaded++;
        // Optional: Could add logic here if needed after *all* images are drawn || for when adding text
        // if (imagesLoaded === totalImages) {
        //   console.log("All images drawn onto canvas");
        // }
      };

      img.onerror = (err) => {
        console.error("Error loading image:", imageSrc, err);
        // Optionally draw a placeholder if an image fails
        const yOffset = borderSize + (imgHeight + photoSpacing) * index;
        context.fillStyle = "lightgray";
        context.fillRect(borderSize, yOffset, imgWidth, imgHeight);
        context.fillStyle = "black";
        context.fillText("Error", borderSize + 10, yOffset + 20);
        imagesLoaded++; // Still count it to avoid waiting forever
      };
    });
  }, [photos, backgroundColor]);

  useEffect(()=> {
    if (photos && photos.length === 4) {
      generatePhotostrip();
    }
  }, [photos, generatePhotostrip]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get the data URL (defaults to PNG)
    const image = canvas.toDataURL("image/png");

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = image;
    link.download = 'photostrip.png'; // Filename for the downloaded image

    // Append link to body, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div>
      {photos.length < 4 ?
        <div>
          There are currently no pictures. 
          Please take some pictures <Link href="/">Here!</Link>
        </div>

        :

        <div>
          {/* Customize Buttons */}
          <div className={styles.customizeButtonsContainer}>
            <p>customize buttons go here</p>

            <div>
              <h3>Change Background Color:</h3>
              <div className={styles.customizeColorsContainer}>
                <button onClick={() => setBackgroundColor("white")} className={styles.colorButton}>White</button>
                <button onClick={() => setBackgroundColor("black")} className={styles.colorButton}>Black</button>
                <button onClick={() => setBackgroundColor("lightblue")} className={styles.colorButton}>Light Blue</button>
                <button onClick={() => setBackgroundColor("lightpink")} className={styles.colorButton}>Light Pink</button>
                <button onClick={() => setBackgroundColor("#f0f0f0")} className={styles.colorButton}>Light Gray</button>
              </div>
            </div>
          </div>

          {/* Photostrip Container */}
          <div className={styles.photoStripContainer}>
            <canvas ref={canvasRef} className={styles.photoStrip} />
          </div>
        </div>
      }

      {/* Control buttons  */}
      <div className={styles.controlButtonsContainer}>
        <Link href="/">
          <button className={styles.startOverButton}>
            Take New Photos
          </button>
        </Link>

        {photos.length === 4 && (
           <button onClick={handleDownload} className={styles.downloadButton}>
             Download Photostrip
           </button>
        )}
      </div>
    </div>
  );
};

export default PhotoStrip;
