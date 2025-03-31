/* eslint-disable @next/next/no-img-element */
"use client"

import { PhotoContext } from "@/context/PhotoState";
import Link from "next/link";
import { useContext } from "react";
import styles from './Photobooth.module.css';


const PhotoStrip = () => {
  const { photos } = useContext(PhotoContext);
  
  return (
    <div className={styles.photoBooth}>
      {photos.length < 4 ?
        <div>
          There are currently no pictures. 
          Please take some pictures <Link href="/">Here!</Link>
        </div>
        :
        <div>
          {photos.map((photo, index) => (
            <div key={index} className="photoContainer">
              <img src={photo} alt={`Booth photo ${index + 1}`} className={photo} />
            </div>
          ))}
        </div>
      }
    </div>
  );
};

export default PhotoStrip;
