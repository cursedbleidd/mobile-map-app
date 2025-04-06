import React, { createContext, useContext, useState, useEffect } from "react";
import * as SQLite from 'expo-sqlite';
import { MarkerInfo } from "../constrains/types";

type MarkerContextType = {
  markers: MarkerInfo[];
  addMarker: (marker: MarkerInfo) => Promise<void>;
  removeMarker: (markerId: string) => Promise<void>;
  updateMarker: (updatedMarker: MarkerInfo) => Promise<void>;
};

interface MarkerDb {
  id: string;
  latitude: number;
  longitude: number;
  title: string | null;
  description: string | null;
  images: string;
}

const MarkerContext = createContext<MarkerContextType | undefined>(undefined);

export const MarkerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [markers, setMarkers] = useState<MarkerInfo[]>([]);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const database = await SQLite.openDatabaseAsync('markers.db');
        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS markers (
            id TEXT PRIMARY KEY,
            latitude REAL,
            longitude REAL,
            title TEXT,
            description TEXT,
            images TEXT
          );
        `);
        setDb(database);
      } catch (error) {
        console.error('Database initialization failed:', error);
      }
    };

    initializeDatabase();
  }, []);

  useEffect(() => {
    const loadMarkers = async () => {
      if (!db) return;

      try {
        const result = await db.getAllAsync('SELECT * FROM markers;') as MarkerDb[];
        const markersArray = result.map((marker: MarkerDb) => ({
          ...marker,
          title: marker.title || undefined,
          description: marker.description || undefined,
          images: JSON.parse(marker.images || '[]'),
        }));
        setMarkers(markersArray);
      } catch (error) {
        console.error('Error loading markers:', error);
      }
    };

    loadMarkers();
  }, [db]);

  const addMarker = async (marker: MarkerInfo) => {
    if (!db) return;
    const statement = await db.prepareAsync(
      `INSERT INTO markers (id, latitude, longitude, title, description, images)
       VALUES (?, ?, ?, ?, ?, ?);`
    );

    try {
      await statement.executeAsync([
        marker.id,
        marker.latitude,
        marker.longitude,
        marker.title || null,
        marker.description || null,
        JSON.stringify(marker.images ?? []),
      ]);
      await statement.finalizeAsync();
      setMarkers(prev => [...prev, marker]);
    } catch (error) {
      console.error('Error adding marker:', error);
    }
  };

  const removeMarker = async (markerId: string) => {
    if (!db) return;

    try {
      const statement = await db.prepareAsync('DELETE FROM markers WHERE id = ?;');
      await statement.executeAsync([markerId]);
      await statement.finalizeAsync();
      setMarkers(prev => prev.filter(marker => marker.id !== markerId));
    } catch (error) {
      console.error('Error removing marker:', error);
    }
  };

  const updateMarker = async (updatedMarker: MarkerInfo) => {
    if (!db) return;

    try {
      const statement = await db.prepareAsync(
        `UPDATE markers 
         SET latitude = ?, longitude = ?, title = ?, description = ?, images = ?
         WHERE id = ?;`
      );
      await statement.executeAsync([
        updatedMarker.latitude,
        updatedMarker.longitude,
        updatedMarker.title ?? null,
        updatedMarker.description ?? null,
        JSON.stringify(updatedMarker.images),
        updatedMarker.id,
      ]);
      await statement.finalizeAsync();
      setMarkers(prev =>
        prev.map(marker => (marker.id === updatedMarker.id ? updatedMarker : marker))
      );
    } catch (error) {
      console.error('Error updating marker:', error);
    }
  };

  if (!db) {
    return null; 
  }

  return (
    <MarkerContext.Provider value={{ markers, addMarker, removeMarker, updateMarker }}>
      {children}
    </MarkerContext.Provider>
  );
};

export const useMarkers = () => {
  const context = useContext(MarkerContext);
  if (!context) throw new Error("useMarkers must be used within a MarkerProvider");
  return context;
};
