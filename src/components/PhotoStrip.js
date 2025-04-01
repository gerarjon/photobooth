/* eslint-disable @next/next/no-img-element */
"use client"

import { PhotoContext } from "@/context/PhotoState";
import { useCallback, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import styles from './Photobooth.module.css';


const PhotoStrip = () => {
  const { photos } = useContext(PhotoContext);
  console.log(photos)
  const canvasRef = useRef(null);

  const generatePhotostrip = useCallback(() => {
    const canvas  = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");

    const imgWidth = 400;
    const imgHeight = 300;
    const borderSize = 40;
    const photoSpacing = 20;
    const textHeight = 50;
    const totalHeight = (imgHeight * 4) + (photoSpacing * 3) + (borderSize * 2) + textHeight;

    canvas.width = imgWidth + borderSize * 2;
    canvas.height = totalHeight;

    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    photos.forEach((image, index) => {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const yOffset = borderSize + (imgHeight + photoSpacing) * index;

        const imageRatio = img.width / img.height;
        const targetRatio = imgWidth / imgHeight;

        let sourceWidth = img.width;
        let sourceHeight = img.height;
        let sourceX = 0;
        let sourceY = 0;

        if (imageRatio > targetRatio) {
          sourceWidth = sourceHeight * targetRatio;
          sourceX = (img.width - sourceWidth) / 2;
        } else {
          sourceHeight = sourceWidth / targetRatio;
          sourceY = (img.height - sourceHeight) / 2;
        }

        context.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,
          borderSize, yOffset, imgWidth, imgHeight
        );
      }
    })
  }, [photos]);

  useEffect(()=> {
    if (photos) {
      generatePhotostrip();
    }
  }, [photos, generatePhotostrip]);
  
  return (
    <div>

      {/* Customize Buttons */}
      <div>
        <p>customize buttons go here</p>
      </div>

      {/* Photostrip Container */}
      <div className={styles.photoStripContainer}>
        {photos.length < 4 ?
          <div>
            There are currently no pictures. 
            Please take some pictures <Link href="/">Here!</Link>
          </div>
          :
          <canvas ref={canvasRef} className={styles.photoStrip} />
        }
      </div>

      {/* Control buttons  */}
      <div className={styles.controlButtonsContainer}>
        <Link href="/">
          <button className={styles.startOverButton}>
            Take New Photos
          </button>
        </Link>
        
      </div>
    </div>
  );
};

export default PhotoStrip;
