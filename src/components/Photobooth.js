/* eslint-disable @next/next/no-img-element */
// components/PhotoBooth.js
import React, { useState, useRef, useEffect, useContext } from 'react';
import styles from './PhotoBooth.module.css';
import { useRouter } from 'next/navigation';
import { PhotoContext } from '@/context/PhotoState';

const Photobooth = () => {
  const { photos, setPhotos } = useContext(PhotoContext)
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [countdownTime, setCountdownTime] = useState(3);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [layout, setLayout] = useState('vertical'); // 'vertical' or 'grid'
  const [stickers, setStickers] = useState([]);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [showCustomization, setShowCustomization] = useState(false);
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
  
  // Sticker data
  const availableStickers = [
    { id: 1, emoji: '😎', size: 50 },
    { id: 2, emoji: '🥳', size: 50 },
    { id: 3, emoji: '❤️', size: 50 },
    { id: 4, emoji: '🌟', size: 50 },
    { id: 5, emoji: '🎉', size: 50 },
    { id: 6, emoji: '🦄', size: 50 },
    { id: 7, emoji: '🔥', size: 50 },
    { id: 8, emoji: '👽', size: 50 },
  ];
  
  // Handle sticker placement
  const handleStickerClick = (sticker) => {
    setSelectedSticker(sticker);
  };
  
  const handleCanvasClick = (e) => {
    if (!selectedSticker || !showCustomization) return;
    
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setStickers([...stickers, {
      ...selectedSticker,
      x,
      y,
    }]);
    
    setSelectedSticker(null);
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
  
  // Initialize Countdown & Capture Sequence
  const startCountdown = () => {
    if (isCapturing) return;
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

        try {
          setPhotos([...newCapturedPhotos]);
          setTimeout(()=> {
            router.push("/preview");
          }, 300);
        } catch (error) {
          console.error("Error nagivating to preview:", error);
          setImages([...newCapturedPhotos]);
        }
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
  
  const sharePhotos = () => {
    // In a full implementation, this could save to a database and generate a shareable URL
    alert("In a complete implementation, this would generate a shareable link to your photos!");
  };
  
  const downloadPhotos = () => {
    // Create a link to download the photo strip
    const link = document.createElement('a');
    link.download = 'photo-booth-strip.png';
    
    // In a real application, we would need to combine the images into a single image here
    // For now, just download the first photo as a demonstration
    link.href = photos[0];
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <div className={styles.cameraSection}>
          {!showCustomization && (
            <>
              <div className={styles.videoContainer}>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline
                  muted
                  className={styles.video}
                />
                {countdown !== null && (
                  <div className={styles.countdown}>{countdown}</div>
                )}
              </div>
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </>
          )}
          
          {!isCapturing && !showCustomization && (
            <button 
              className={styles.startButton}
              onClick={startCountdown}
            >
              Start Photo Booth
            </button>
          )}
          
          {isCapturing && (
            <div className={styles.status}>
              Taking photo {currentPhotoIndex} of 4
            </div>
          )}
        </div>

        {/* images preview */}
        <div>
          {photos.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Captured ${index + 1}`}
            />
          ))}
        </div>
        
        {showCustomization && (
          <div className={styles.customizationPanel}>
            <h2>Customize Your Photos</h2>
            
            <div className={styles.layoutOptions}>
              <h3>Layout:</h3>
              <div className={styles.layoutButtons}>
                <button 
                  onClick={() => setLayout('vertical')}
                  className={`${styles.layoutButton} ${layout === 'vertical' ? styles.active : ''}`}
                >
                  Vertical Strip
                </button>
                <button 
                  onClick={() => setLayout('grid')}
                  className={`${styles.layoutButton} ${layout === 'grid' ? styles.active : ''}`}
                >
                  Grid
                </button>
              </div>
            </div>
            
            <div className={styles.stickerOptions}>
              <h3>Add Stickers:</h3>
              <div className={styles.stickerGallery}>
                {availableStickers.map(sticker => (
                  <button 
                    key={sticker.id}
                    className={`${styles.stickerButton} ${selectedSticker?.id === sticker.id ? styles.active : ''}`}
                    onClick={() => handleStickerClick(sticker)}
                  >
                    <span style={{ fontSize: '24px' }}>{sticker.emoji}</span>
                  </button>
                ))}
              </div>
              {selectedSticker && (
                <p className={styles.stickerInstructions}>Click on the photo to place the sticker</p>
              )}
            </div>
            
            <div className={styles.actionButtons}>
              <button 
                className={styles.startOverButton}
                onClick={startPhotoSession}
              >
                Start Over
              </button>
              <button 
                className={styles.downloadButton}
                onClick={downloadPhotos}
              >
                Download
              </button>
              <button 
                className={styles.shareButton}
                onClick={sharePhotos}
              >
                Share
              </button>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Photobooth;