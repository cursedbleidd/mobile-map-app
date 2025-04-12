import * as Location from 'expo-location'
import { getDistance } from 'geolib'

interface LocationConfig {
    accuracy: Location.Accuracy;
    timeInterval: number;
    distanceInterval: number;
  }
  
export interface LocationState {
    location: Location.LocationObject | null;
    errorMsg: string | null;
}

export const requestLocationPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Доступ к местоположению не разрешён');
    }
};
  
export const startLocationUpdates = async (
  onLocation: (location: Location.LocationObject) => void
) => {
  return await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 5000,
      distanceInterval: 5
    },
    onLocation
  );
};


export const calculateDistance = (
  lat1: number,
  long1: number,
  lat2: number,
  long2: number
): number => getDistance(
  { latitude: lat1, longitude: long1 },
  { latitude: lat2, longitude: long2 }
)