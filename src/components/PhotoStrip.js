/* eslint-disable @next/next/no-img-element */
"use client"

import { PhotoContext } from "@/context/PhotoState";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from './Photobooth.module.css';

// Images & Overlays
import pikachuOverlayUrl from '@/assets/frames/pikachuOverlay.png';

// Helper function to draw a star
const drawStar = (ctx, x, y, arms, outerRadius, innerRadius, color = 'gold') => {
  ctx.fillStyle = color;
  ctx.beginPath();
  let rot = Math.PI / 2 * 3;
  let step = Math.PI / arms;

  ctx.moveTo(x, y - outerRadius);
  for (let i = 0; i < arms; i++) {
    let currentX = x + Math.cos(rot) * outerRadius;
    let currentY = y + Math.sin(rot) * outerRadius;
    ctx.lineTo(currentX, currentY);
    rot += step;

    currentX = x + Math.cos(rot) * innerRadius;
    currentY = y + Math.sin(rot) * innerRadius;
    ctx.lineTo(currentX, currentY);
    rot += step;
  }
  ctx.lineTo(x, y - outerRadius);
  ctx.closePath();
  ctx.fill();
}

// Helper function to draw a heart
const drawHeart = (ctx, x, y, width, height, color = 'red') => {
    ctx.fillStyle = color;
    ctx.beginPath();
    const topCurveHeight = height * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    // Top left curve
    ctx.bezierCurveTo(
        x, y,
        x - width / 2, y,
        x - width / 2, y + topCurveHeight
    );
    // Bottom left curve
    ctx.bezierCurveTo(
        x - width / 2, y + (height + topCurveHeight) / 2,
        x, y + (height + topCurveHeight) / 2,
        x, y + height
    );
    // Bottom right curve
    ctx.bezierCurveTo(
        x, y + (height + topCurveHeight) / 2,
        x + width / 2, y + (height + topCurveHeight) / 2,
        x + width / 2, y + topCurveHeight
    );
    // Top right curve
    ctx.bezierCurveTo(
        x + width / 2, y,
        x, y,
        x, y + topCurveHeight
    );
    ctx.closePath();
    ctx.fill();
}

const PhotoStrip = () => {
  const { photos } = useContext(PhotoContext);
  const canvasRef = useRef(null);
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [frameTheme, setFrameTheme] = useState("none");
  const [loadedAssets, setLoadedAssets] = useState({});
  const [isLoadingAssets, setIsLoadingAssets] = useState(true);

  // --- Map theme names/IDs to imported asset URLs ---
  const assetMap = useRef({ 
    pikachu_frame: pikachuOverlayUrl,
  }).current;

  // --- Effect to preload image assets on mount ---
  useEffect(() => {
    setIsLoadingAssets(true);
    const images = {};
    let loadedCount = 0;
    const totalImages = Object.keys(assetMap).length;

    if (totalImages === 0) {
        setIsLoadingAssets(false);
        return;
    }

    Object.entries(assetMap).forEach(([key, src]) => {
      const img = new Image();
      img.onload = () => {
        images[key] = img;
        loadedCount++;
        if (loadedCount === totalImages) {
          setLoadedAssets(images);
          setIsLoadingAssets(false);
          console.log("All custom assets loaded.");
        }
      };
      img.onerror = () => {
        console.error(`Failed to load asset: ${key} from ${src}`);
        loadedCount++;
         if (loadedCount === totalImages) {
          setLoadedAssets(images);
          setIsLoadingAssets(false);
        }
      };
      img.src = src.src;
    });

    // Optional: Cleanup function if needed
    // return () => { /* ... */ }

  }, [assetMap]); 

  const drawFrameOverlay = useCallback((context, canvas, theme) => {
    const width = canvas.width;
    const height = canvas.height;
    context.lineWidth = 1;
    const imgWidth = 400;
    const imgHeight = 300;
    const borderSize = 40;
    const photoSpacing = 20;

    switch (theme) {
      case 'hearts':
        // Draw hearts in corners or specific spots
        drawHeart(context, borderSize + 30, borderSize + 30, 25, 25, 'rgba(255, 0, 0, 0.8)');
        drawHeart(context, width - borderSize - 30, borderSize + 30, 25, 25, 'rgba(255, 0, 0, 0.8)');
        drawHeart(context, borderSize + 30, height - borderSize - 30, 25, 25, 'rgba(255, 0, 0, 0.8)');
        drawHeart(context, width - borderSize - 30, height - borderSize - 30, 25, 25, 'rgba(255, 0, 0, 0.8)');
        // Example: Heart between first two photos
        const midY1 = borderSize + imgHeight + (photoSpacing / 2);
        drawHeart(context, width / 2, midY1, 20, 20, 'rgba(255, 105, 180, 0.8)'); // Pink
        break;
      case 'stars':
        // Draw stars
        drawStar(context, borderSize + 40, borderSize + 40, 5, 15, 7, 'rgba(255, 215, 0, 0.8)'); // Gold
        drawStar(context, width - borderSize - 40, borderSize + 40, 5, 15, 7, 'rgba(255, 215, 0, 0.8)');
        drawStar(context, width / 2, height - borderSize - 40, 5, 20, 10, 'rgba(255, 255, 0, 0.8)'); // Yellow
         // Example: Small stars between photos
        const midY2 = borderSize + imgHeight + imgHeight + photoSpacing + (photoSpacing / 2);
        drawStar(context, borderSize + 30, midY2, 5, 8, 4, 'rgba(173, 216, 230, 0.9)'); // Light blue
        drawStar(context, width - borderSize - 30, midY2, 5, 8, 4, 'rgba(173, 216, 230, 0.9)');
        break;
      case 'vintage':
        context.strokeStyle = 'rgba(139, 69, 19, 0.7)'; // SaddleBrown slightly transparent
        context.lineWidth = 8;
        // Draw an inner border rect slightly inside the main border
        const innerMargin = 10; // Offset from the edge of the strip border
        context.strokeRect(
            innerMargin,
            innerMargin,
            width - 2 * innerMargin,
            height - 2 * innerMargin
        );
        context.lineWidth = 1; // Reset line width
        break;

        // --- Add Case for Image-based Frame ---
        // case 'floral_frame':
        //   const frameImg = //... get preloaded floral frame Image object ...;
        //   if (frameImg && frameImg.complete) { // Check if loaded
        //      context.drawImage(frameImg, 0, 0, width, height);
        //   }
        //   break;

      case 'pikachu_frame':
        const pikachuFrameImg = loadedAssets.pikachu_frame;
          if (pikachuFrameImg) {
            context.drawImage(pikachuFrameImg, 0, 0, width, height);
        } else if (!isLoadingAssets) {
            console.warn("Party frame asset not loaded");
        }
        break;

      case 'none':
      default:
        break;
    }
  }, [loadedAssets, isLoadingAssets]);

  const generatePhotostrip = useCallback(() => {
    const canvas  = canvasRef.current;

    if (!canvas || photos.length < 4 || isLoadingAssets) {
      if (canvas) {
        const context = canvas.getContext("2d");
        context.fillStyle = 'lightgray';
        context.fillRect(0,0, canvas.width, canvas.height);
        context.fillStyle = 'black';
        context.fillText("Loading Assets...", 50, 50);
      }
      return;
    }

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
        if (imagesLoaded === totalImages) {
          drawFrameOverlay(context, canvas, frameTheme);
        }
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
  }, [photos, backgroundColor, frameTheme, isLoadingAssets, drawFrameOverlay]);

  useEffect(() => {
    // Generate only if photos are ready AND assets are loaded
    if (photos && photos.length === 4 && !isLoadingAssets) {
      generatePhotostrip();
    }
     // Show loading state on canvas if photos ready but assets aren't
    else if (photos && photos.length === 4 && isLoadingAssets && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.width = 480;
      canvas.height = 1400;
      context.fillStyle = 'lightgray';
      context.fillRect(0,0, canvas.width, canvas.height);
      context.fillStyle = 'black';
      context.font = "20px sans-serif";
      context.textAlign = "center";
      context.fillText("Loading assets...", canvas.width / 2, canvas.height / 2);
    }
  }, [photos, generatePhotostrip, isLoadingAssets]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get the data URL (defaults to PNG)Í
    const image = canvas.toDataURL("image/png");

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = image;
    link.download = `photostrip_${Date.now()}.png`; // Filename for the downloaded image

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

            <div>
              <p>Customize Frame/Stickers:</p>

              <button onClick={() => setFrameTheme('none')} className={styles.frameButton}>None</button>
              <button onClick={() => setFrameTheme('pikachu_frame')} className={styles.themeButton} disabled={isLoadingAssets || !loadedAssets.pikachu_frame}>Pikachu</button>
              <button onClick={() => setFrameTheme('hearts')} className={styles.frameButton}>Hearts</button>
              <button onClick={() => setFrameTheme('stars')} className={styles.frameButton}>Stars</button>
              <button onClick={() => setFrameTheme('vintage')} className={styles.frameButton}>Vintage Border</button>
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
             Download
           </button>
        )}
      </div>
    </div>
  );
};

export default PhotoStrip;
