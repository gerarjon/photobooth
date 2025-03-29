"use client"
import { PhotoContext } from "@/context/PhotoState";
import Link from "next/link";
import { useContext } from "react";


const PhotoStrip = () => {
  const { photos } = useContext(PhotoContext);
  
  return (

    <div>
      {photos.length < 4 ?
        <div>
          There are currently no pictures. 
          Please take some pictures <Link href="/">Here!</Link>
        </div>
        :
        <div 
          // className={`${photoStrip} ${styles[layout]}`}
          // onClick={handleCanvasClick}
        >
          {photos.map((photo, index) => (
            <div key={index} className="photoContainer">
              {/* Using img instead of Next.js Image for data URIs */}
              <img src={photo} alt={`Booth photo ${index + 1}`} className={photo} />
              {/* {stickers
                .filter(s => s.photoIndex === index || s.photoIndex === undefined)
                .map((sticker, i) => (
                  <div 
                    key={i}
                    className={styles.sticker}
                    style={{
                      position: 'absolute',
                      left: sticker.x,
                      top: sticker.y,
                      fontSize: `${sticker.size}px`,
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer'
                    }}
                  >
                    {sticker.emoji}
                  </div>
                ))} */}
            </div>
          ))}
        </div>
      }
    </div>
  );
};

export default PhotoStrip;
