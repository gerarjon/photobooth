'use client'

import { createContext, useState } from "react";

export const PhotoContext = createContext(null);

export function PhotoStateProvider({ children }) {
  const [photos, setPhotos] = useState([]);

  return (
    <PhotoContext.Provider value={{ photos, setPhotos }}>
      {children}
    </PhotoContext.Provider>
  );
}