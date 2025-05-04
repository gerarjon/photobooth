"use client"

import { PhotoContext } from "@/context/PhotoState";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from './Photobooth.module.css';

// Images & Overlays
import pikachuOverlay1x4Url from '@/assets/frames/pikachuOverlay_1x4.png';
import pikachuOverlay2x2Url from '@/assets/frames/pikachuOverlay_2x2.png';
import pikachuOverlay4x1Url from '@/assets/frames/pikachuOverlay_4x1.png';
import twiceOverlay1x4Url from '@/assets/frames/twiceOverlay_1x4.png';
import twiceOverlay2x2Url from '@/assets/frames/twiceOverlay_2x2.png';
import twiceOverlay4x1Url from '@/assets/frames/twiceOverlay_4x1.png';
import chickenOverlay1x4Url from '@/assets/frames/chickenOverlay_1x4.png';
import chickenOverlay2x2Url from '@/assets/frames/chickenOverlay_2x2.png';
import chickenOverlay4x1Url from '@/assets/frames/chickenOverlay_4x1.png';
import dogOverlay1x4Url from '@/assets/frames/dogOverlay_1x4.png';
import dogOverlay2x2Url from '@/assets/frames/dogOverlay_2x2.png';
import dogOverlay4x1Url from '@/assets/frames/dogOverlay_4x1.png';
import sbdOverlay1x4Url from '@/assets/frames/sbdOverlay_1x4.png';
import sbdOverlay2x2Url from '@/assets/frames/sbdOverlay_2x2.png';
import sbdOverlay4x1Url from '@/assets/frames/sbdOverlay_4x1.png';
// import susOverlayUrl from '@/assets/frames/susOverlay.png';

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

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${month}/${day}/${year}`;
}

const formatDateNoSlash = (timestamp) => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${month}${day}${year}`;
}

// ----------------------------------------- //

const PhotoStrip = () => {
  const { photos } = useContext(PhotoContext);
  const canvasRef = useRef(null);
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [frameTheme, setFrameTheme] = useState("none");
  const [loadedAssets, setLoadedAssets] = useState({});
  const [isLoadingAssets, setIsLoadingAssets] = useState(true);
  const [photoOrientation, setPhotoOrientation] = useState('1x4');

  // --- Map theme names/IDs to imported asset URLs ---
  const assetMap = useRef({ 
    pikachu_frame: {
      "1x4" : pikachuOverlay1x4Url,
      "2x2" : pikachuOverlay2x2Url,
      "4x1" : pikachuOverlay4x1Url
    },
    twice_frame: {
      "1x4" : twiceOverlay1x4Url,
      "2x2" : twiceOverlay2x2Url,
      "4x1" : twiceOverlay4x1Url,
    },
    chicken_frame: {
      "1x4" : chickenOverlay1x4Url,
      "2x2" : chickenOverlay2x2Url,
      "4x1" : chickenOverlay4x1Url,
    },
    dog_frame: {
      "1x4" : dogOverlay1x4Url,
      "2x2" : dogOverlay2x2Url,
      "4x1" : dogOverlay4x1Url
    },
    sbd_frame: {
      "1x4" : sbdOverlay1x4Url,
      "2x2" : sbdOverlay2x2Url,
      "4x1" : sbdOverlay4x1Url
    },
    // sus_frame: susOverlayUrl,
  }).current;

  // --- Effect to preload image assets on mount ---
  useEffect(() => {
    setIsLoadingAssets(true);
    const images = {};
    let loadedCount = 0;
    
    let totalImages = 0;
    Object.values(assetMap).forEach(orientations => {
      totalImages += Object.keys(orientations).length;
    });
    
    if (totalImages === 0) {
      setIsLoadingAssets(false);
      return;
    }
    
    // Load each image
    Object.entries(assetMap).forEach(([frameName, orientations]) => {
      images[frameName] = {};
      
      // Load each orientation for this frame
      Object.entries(orientations).forEach(([orientation, src]) => {
        const img = new Image();
        
        img.onload = () => {
          images[frameName][orientation] = img;
          loadedCount++;
          
          if (loadedCount === totalImages) {
            setLoadedAssets(images);
            setIsLoadingAssets(false);
            console.log("All custom assets loaded.");
          }
        };
        
        img.onerror = () => {
          console.error(`Failed to load asset: ${frameName} (${orientation}) from ${src}`);
          loadedCount++;
          
          if (loadedCount === totalImages) {
            setLoadedAssets(images);
            setIsLoadingAssets(false);
          }
        };
        
        img.src = src.src;
      });
    });
    
    // Optional: Cleanup function if needed
    // return () => { /* ... */ }
  }, [assetMap]); 

  const drawFrameOverlay = useCallback((context, canvas, theme, photoOrientation) => {
    const width = canvas.width;
    const height = canvas.height;
    context.lineWidth = 1;
    const imgWidth = 400;
    const imgHeight = 300;
    const borderSize = 40;
    const photoSpacing = 20;

    const orientation = photoOrientation || "1x4";

    if (theme === 'hearts') {
      drawHeart(context, borderSize + 30, borderSize + 30, 25, 25, 'rgba(255, 0, 0, 0.8)');
      drawHeart(context, width - borderSize - 30, borderSize + 30, 25, 25, 'rgba(255, 0, 0, 0.8)');
      drawHeart(context, borderSize + 30, height - borderSize - 30, 25, 25, 'rgba(255, 0, 0, 0.8)');
      drawHeart(context, width - borderSize - 30, height - borderSize - 30, 25, 25, 'rgba(255, 0, 0, 0.8)');
      const midY1 = borderSize + imgHeight + (photoSpacing / 2);
      drawHeart(context, width / 2, midY1, 20, 20, 'rgba(255, 105, 180, 0.8)'); // Pink
    } else if (theme === 'stars') {
      drawStar(context, borderSize + 40, borderSize + 40, 5, 15, 7, 'rgba(255, 215, 0, 0.8)'); // Gold
      drawStar(context, width - borderSize - 40, borderSize + 40, 5, 15, 7, 'rgba(255, 215, 0, 0.8)');
      drawStar(context, width / 2, height - borderSize - 40, 5, 20, 10, 'rgba(255, 255, 0, 0.8)'); // Yellow
      const midY2 = borderSize + imgHeight + imgHeight + photoSpacing + (photoSpacing / 2);
      drawStar(context, borderSize + 30, midY2, 5, 8, 4, 'rgba(173, 216, 230, 0.9)'); // Light blue
      drawStar(context, width - borderSize - 30, midY2, 5, 8, 4, 'rgba(173, 216, 230, 0.9)');
    } else if (theme.endsWith('_frame') && theme !== 'none') {
      // Draw the image-based frame
      if (loadedAssets[theme] && loadedAssets[theme][orientation]) {
        context.drawImage(loadedAssets[theme][orientation], 0, 0, width, height);
      } else if (!isLoadingAssets) {
        console.warn(`${theme} asset not loaded for orientation: ${orientation}`);
      }
    }
  }, [loadedAssets, isLoadingAssets]);

  const drawText = useCallback((context, canvas, totalHeight, borderSize) => {
    const date = formatDate(Date.now());
    context.fillStyle = (backgroundColor === "black" || backgroundColor === "gradient") ? "#FFFFFF" : "#000000";
    context.font = "200 16px Arial";
    context.textAlign = "center";

    context.fillText(date, canvas.width - borderSize * 1.75 , totalHeight - borderSize / 2);
  }, [backgroundColor]);

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

    // Set dimensions based on orientation using switch
    let canvasWidth, canvasHeight, imgWidth, imgHeight, targetRatio;
    const borderSize = 40;
    const photoSpacing = 20;
    const textHeight = 50;
    
    switch (photoOrientation) {
      case '1x4':
        // Vertical layout (4 photos stacked)
        imgWidth = 400;
        imgHeight = 300;
        targetRatio = imgWidth / imgHeight; 
        canvasWidth = imgWidth + borderSize * 2;
        canvasHeight = (imgHeight * 4) + (photoSpacing * 3) + (borderSize * 2) + textHeight;
        break;
      
      case '2x2':
        // Square/grid layout (2x2)
        imgWidth = 320;
        imgHeight = 320;
        targetRatio = imgWidth / imgHeight; 
        canvasWidth = (imgWidth * 2) + photoSpacing + (borderSize * 2);
        canvasHeight = (imgHeight * 2) + photoSpacing + (borderSize * 2) + textHeight;
        break;
        
      case '4x1': // Example of a future layout
        // Horizontal strip layout (4 photos in a row)
        imgHeight = 200;
        targetRatio = 4 / 3;
        imgWidth = Math.round(imgHeight * targetRatio); // Calculate width (~267)
        canvasWidth = (imgWidth * 4) + (photoSpacing * 3) + (borderSize * 2);
        canvasHeight = imgHeight + (borderSize * 2) + textHeight;
        break;
        
      default:
        // Fall back to vertical as default
        imgWidth = 400;
        imgHeight = 300;
        canvasWidth = imgWidth + borderSize * 2;
        canvasHeight = (imgHeight * 4) + (photoSpacing * 3) + (borderSize * 2) + textHeight;
        break;
    }
    
    const totalHeight = canvasHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    context.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#F53843'); //red
    gradient.addColorStop(1/6, '#F7BB3F'); //orange
    gradient.addColorStop(2/6, '#FDEA58'); //yello
    gradient.addColorStop(3/6, '#4BEE4D'); //green
    gradient.addColorStop(4/6, '#7CD3FF'); //blue
    gradient.addColorStop(5/6, '#D75CFE'); //purple
    gradient.addColorStop(1, '#FED8FF'); //pink

    if (backgroundColor === "gradient") setBackgroundColor(gradient);

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Keep track of images loaded
    let imagesLoaded = 0;
    const totalImagesToLoad = photos.length;

    photos.forEach((imageSrc, index) => {
      const img = new Image();
      img.src = imageSrc;
      img.crossOrigin = "Anonymous";

      img.onload = () => {
        let xOffset, yOffset;
      
        switch (photoOrientation) {
          case '1x4':
            xOffset = borderSize;
            yOffset = borderSize + (imgHeight + photoSpacing) * index;
            break;
          
          case '2x2':
            xOffset = borderSize + (index % 2) * (imgWidth + photoSpacing);
            yOffset = borderSize + Math.floor(index / 2) * (imgHeight + photoSpacing);
            break;
            
          case '4x1':
            xOffset = borderSize + (imgWidth + photoSpacing) * index;
            yOffset = borderSize;
            break;
            
          // Add more cases here in the future
          
          default:
            // Fall back to vertical as default
            xOffset = borderSize;
            yOffset = borderSize + (imgHeight + photoSpacing) * index;
            break;
        }

        const imageRatio = img.width / img.height;

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
          xOffset, yOffset, imgWidth, imgHeight // Change borderSize to xOffset
        );

        imagesLoaded++;
        // --- Draw overlay and text ONLY after ALL images are loaded and drawn ---
        if (imagesLoaded === totalImagesToLoad) {
          drawFrameOverlay(context, canvas, frameTheme, photoOrientation);
          drawText(context, canvas, totalHeight, borderSize, textHeight);
        }
        // Optional: Could add logic here if needed after *all* images are drawn || for when adding text
        // if (imagesLoaded === totalImages) {
        //   console.log("All images drawn onto canvas");
        // }
      };

      img.onerror = (err) => {
        console.error("Error loading image:", imageSrc, err);
        // Calculate position with switch for the error placeholder too
        let xOffset, yOffset;
        
        switch (photoOrientation) {
          case '1x4':
            xOffset = borderSize;
            yOffset = borderSize + (imgHeight + photoSpacing) * index;
            break;
          
          case '2x2':
            xOffset = borderSize + (index % 2) * (imgWidth + photoSpacing);
            yOffset = borderSize + Math.floor(index / 2) * (imgHeight + photoSpacing);
            break;
            
          case '4x1':
            xOffset = borderSize + (imgWidth + photoSpacing) * index;
            yOffset = borderSize;
            break;
            
          default:
            xOffset = borderSize;
            yOffset = borderSize + (imgHeight + photoSpacing) * index;
            break;
        }

        context.fillStyle = "lightgray";
        context.fillRect(xOffset, yOffset, imgWidth, imgHeight);
        context.fillStyle = "black";
        context.fillText("Error", xOffset + 10, yOffset + 20);
        
        imagesLoaded++; // Still count it to avoid waiting forever
        // --- Draw overlay and text ONLY after ALL images are loaded and drawn ---
        if (imagesLoaded === totalImagesToLoad) {
          drawFrameOverlay(context, canvas, frameTheme);
          drawText(context, canvas, totalHeight, borderSize, textHeight);
        }
      };
    });
  }, [photos, backgroundColor, frameTheme, photoOrientation, isLoadingAssets, drawFrameOverlay, drawText]);

  useEffect(() => {
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
      context.font = "bold 30px sans-serif";
      context.textAlign = "center";
      context.fillText("Loading assets...", canvas.width / 2, canvas.height / 2);
    }
  }, [photos, generatePhotostrip, isLoadingAssets]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || isLoadingAssets) {
      alert("Cannot download: Canvas not ready or assets are loading.");
      return;
    }

    try {
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `PicturanCo_${formatDateNoSlash(Date.now())}_${photoOrientation}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading photostrip:", error);
      let userMessage = "Failed to download photostrip.";
      if (error.name === 'SecurityError') {
          userMessage += "\n\nThis might be due to browser security restrictions, especially if the images used came from a different origin (like a webcam stream directly drawn to canvas without proper handling).";
      } else {
          userMessage += `\n\nError details: ${error.message}`;
      }
      alert(userMessage);
    }
  };
  
  return (
    <div>
      {photos.length < 4 ?
        <div>
          There are currently no pictures. 
          Please take some pictures <Link href="/">[Here!]</Link>
        </div>

        :

        <div className={styles.photoStripMainContainer}>
          {/* Customize Buttons */}
          <div className={styles.customizeButtonsContainer}>
            {/* Orientation */}
            <div>
              <h4>Orientation</h4>

              <div className={styles.orientationSelector}>
                <label>
                  <input 
                    type="radio" 
                    value="1x4" 
                    checked={photoOrientation === '1x4'} 
                    onChange={() => setPhotoOrientation('1x4')} 
                  />
                  Vertical
                </label>
                <label>
                  <input 
                    type="radio" 
                    value="2x2" 
                    checked={photoOrientation === '2x2'} 
                    onChange={() => setPhotoOrientation('2x2')} 
                  />
                  Grid
                </label>
                <label>
                  <input 
                    type="radio" 
                    value="4x1" 
                    checked={photoOrientation === '4x1'} 
                    onChange={() => setPhotoOrientation('4x1')} 
                  />
                  Horizontal
                </label>
              </div>
            </div>

            {/* Colors */}
            <div>
              <h4>Frame Color:</h4>

              <div className={styles.customizeStylesContainer }>
                <button onClick={() => setBackgroundColor("white")} className={`${styles.colorButton} white`}></button>
                <button onClick={() => setBackgroundColor("black")} className={`${styles.colorButton} black`}></button>
                <button onClick={() => setBackgroundColor("#f0f0f0")} className={`${styles.colorButton} gray`}></button>
                <button onClick={() => setBackgroundColor("#f53843")} className={`${styles.colorButton} red`}></button>
                <button onClick={() => setBackgroundColor("#f7bb3f")} className={`${styles.colorButton} orange`}></button>
                <button onClick={() => setBackgroundColor("#fdea58")} className={`${styles.colorButton} yellow`}></button>
                <button onClick={() => setBackgroundColor("#4bee4d")} className={`${styles.colorButton} green`}></button>
                <button onClick={() => setBackgroundColor("#7cd3ff")} className={`${styles.colorButton} blue`}></button>
                <button onClick={() => setBackgroundColor("#d75cfe")} className={`${styles.colorButton} purple`}></button>
                <button onClick={() => setBackgroundColor("#fed8ff")} className={`${styles.colorButton} pink`}></button>
                <button onClick={() => setBackgroundColor("gradient")} className={`${styles.colorButton} rainbow`}></button>
              </div>
            </div>

            {/* Overlay */}
            <div>
              <h4>Overlay & Stickers:</h4>

              <div className={styles.customizeStylesContainer}>
                <button onClick={() => setFrameTheme('none')} className={styles.frameButton}>None</button>
                <button onClick={() => setFrameTheme('pikachu_frame')} className={styles.frameButton} disabled={isLoadingAssets || !loadedAssets.pikachu_frame}>Pikachu</button>
                <button onClick={() => setFrameTheme('twice_frame')} className={styles.frameButton} disabled={isLoadingAssets || !loadedAssets.twice_frame}>TWICE</button>
                <button onClick={() => setFrameTheme('chicken_frame')} className={styles.frameButton} disabled={isLoadingAssets || !loadedAssets.chicken_frame}>Chicken</button>
                <button onClick={() => setFrameTheme('dog_frame')} className={styles.frameButton} disabled={isLoadingAssets || !loadedAssets.dog_frame}>Dog</button>
                <button onClick={() => setFrameTheme('sbd_frame')} className={styles.frameButton} disabled={isLoadingAssets || !loadedAssets.sbd_frame}>SBD</button>
                {/* <button onClick={() => setFrameTheme('sus_frame')} className={styles.frameButton} disabled={isLoadingAssets || !loadedAssets.sus_frame}>Sus</button> */}
                <button onClick={() => setFrameTheme('stars')} className={styles.frameButton}>Stars</button>
              </div>
            </div>

            {/* Control buttons  */}
            <div className={styles.controlButtonsContainer}>
              <Link href="/photobooth">
                <button className={styles.startOverButton}>
                  Take New Photos
                </button>
              </Link>

              {photos.length === 4 && (
                <button onClick={handleDownload} className={styles.downloadButton} disabled={isLoadingAssets}>
                  Download
                </button>
              )}
            </div>
          </div>

          {/* Photostrip Container */}
          <div className={`${styles.photoStripContainer} ${photoOrientation === '4x1' || photoOrientation == '2x2' ? styles.horizontal : styles.vertical}`}>
            <canvas 
              ref={canvasRef} 
              className={styles.photoStrip} 
            />
          </div>
        </div>
      }
    </div>
  );
};

export default PhotoStrip;
