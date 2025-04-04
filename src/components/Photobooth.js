/* eslint-disable @next/next/no-img-element */
// components/PhotoBooth.js
import React, { useState, useRef, useEffect, useContext } from 'react';
import styles from './Photobooth.module.css';
import { useRouter } from 'next/navigation';
import { PhotoContext } from '@/context/PhotoState';

const Photobooth = () => {
  const { photos, setPhotos } = useContext(PhotoContext)
  const [isCapturing, setIsCapturing] = useState(false);
  const [photosComplete, setPhotosComplete] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [countdownTime, setCountdownTime] = useState(3);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [cameraPermission, setCameraPermission] = useState('pending');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const router = useRouter();
  
  // Initialize camera
  useEffect(() => {
    if (typeof window !== 'undefined' && !mediaStreamRef.current) {
      setupCamera();
    }
    
    return () => {
      // Cleanup camera stream when component unmounts
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;
        setCameraPermission('granted');
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please ensure camera permissions are granted for browser settings!")
      setCameraPermission('denied');
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };
  
  // Takes Picture
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = video.videoWidth;
    tempCanvas.height = video.videoHeight;
    const tempContext = tempCanvas.getContext('2d');

    tempContext.save();
    tempContext.translate(tempCanvas.width, 0);
    tempContext.scale(-1, 1);
    tempContext.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    )
    tempContext.restore();

    context.save();

    // Draw the current video frame to the canvas
    context.drawImage(tempCanvas, 0, 0);
    
    // Convert canvas to data URL
    const photoData = canvas.toDataURL('image/png');
  
    
    return photoData;
  };

  const handleToPreview = () => {
    try {
      setTimeout(()=> {
        stopCamera();
        router.push("/photostrip");
      }, 300);
    } catch (error) {
      console.error("Error nagivating to preview:", error);
      setImages([...newCapturedPhotos]);
    }
  }
  
  // Initialize Countdown & Capture Sequence
  const startCountdown = () => {
    if (isCapturing) return;
    setPhotosComplete(false);
    setIsCapturing(true);
    setCountdown(3);
    setCurrentPhotoIndex(0);
    setPhotos([]);

    let photosTaken = 0;
    const newCapturedPhotos = [];

    const captureSequence = async () => {
      if (photosTaken >= 4) {
        setCountdown(null);
        setIsCapturing(false);
        setPhotosComplete(true);
        setPhotos([...newCapturedPhotos]);
        return;
      }

      let timeLeft = countdownTime;
      setCountdown(timeLeft);
      
      const interval = setInterval(() => {
        timeLeft-=1;
        setCountdown(timeLeft);

        if (timeLeft === 0) {
          clearInterval(interval);
          const imageUrl = capturePhoto();
          if (imageUrl) {
            newCapturedPhotos.push(imageUrl);
            setPhotos((prevPhotos) => [...prevPhotos, imageUrl]);
          }
          photosTaken += 1;
          setTimeout(captureSequence, 1000);
        }
      }, 1000);
      setCurrentPhotoIndex(prevPhotoIndex => prevPhotoIndex + 1);
    };

    captureSequence();
  };
  
  if (cameraPermission === 'denied') {
    return (
      <div className={styles.permissionDenied}>
        <h2>Camera Access Required</h2>
        <p>Please allow camera access to use the photo booth.</p>
        <button onClick={setupCamera} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className={styles.photoBooth}>
      <div className={styles.boothContainer}>

        {/* Camera Section */}
        <div className={styles.cameraSection}>
          <div
            className={styles.videoContainer}
            style={{
              ...(cameraPermission === "pending" && { backgroundColor: "#444444" })
            }}
          >
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              muted
              className={styles.video}
              style={{ 
                visibility: cameraPermission === "pending" ? "hidden" : "visible", 
                height: cameraPermission === "pending" ? "450px" : "100%"
              }}
            />
            {countdown !== null && (
              <div className={styles.countdown}>{countdown}</div>
            )}
          </div>

          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {cameraPermission === "pending" && (
            <p className={styles.pendingText}>Waiting for Camera Access...</p>
          )}
        </div>

        {/* Control Buttons */}
        <div className={styles.controlButtonsContainer}>
          {!isCapturing && (
            <button 
              className={styles.startButton}
              onClick={startCountdown}
              disabled={cameraPermission === "pending"}
            >
              {!photosComplete ? "Start" : "Redo"}
            </button>
          )}

          {!isCapturing && photosComplete && (
            <button
              className={styles.nextButton}
              onClick={handleToPreview}
            >
              Next
            </button>
          )}

          {isCapturing && (
            <div className={styles.status}>
              Taking photo {currentPhotoIndex} of 4
            </div>
          )}
        </div>

        {/* Images Preview */}
        <div className={styles.photoPreviewContainer}>
          <div className={styles.photoPreview}>
            {photos.map((image, index) => (
              <img
                className={styles.photoPreviewSingle}
                key={index}
                src={image}
                alt={`Captured ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Photobooth;