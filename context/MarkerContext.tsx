import React, { createContext, useContext, useState } from "react";

type MarkerImages = {
  [key: string]: string[]; // Each marker ID maps to an array of image URIs
};

type MarkerContextType = {
  markerImages: MarkerImages;
  addImages: (markerId: string, newImages: string[]) => void;
  removeImage: (markerId: string, imageUri: string) => void;
};

const MarkerContext = createContext<MarkerContextType | undefined>(undefined);

export const MarkerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [markerImages, setMarkerImages] = useState<MarkerImages>({});

  const addImages = (markerId: string, newImages: string[]) => {
    setMarkerImages(prev => ({
      ...prev,
      [markerId]: [...(prev[markerId] || []), ...newImages],
    }));
  };

  const removeImage = (markerId: string, imageUri: string) => {
    setMarkerImages(prev => ({
        ...prev,
        [markerId]: prev[markerId]?.filter(img => img !== imageUri) || [],
      }));
  }

  return (
    <MarkerContext.Provider value={{ markerImages, addImages, removeImage }}>
      {children}
    </MarkerContext.Provider>
  );
};

export const useMarkerImages = () => {
  const context = useContext(MarkerContext);
  if (!context) throw new Error("useMarkerImages must be used within a MarkerProvider");
  return context;
};
