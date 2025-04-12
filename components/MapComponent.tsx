import { useEffect, useState } from "react";
import { Text, ActivityIndicator } from "react-native";

import MapView from "react-native-maps";
import { MarkerList } from "./MarkerList";

import { MarkerInfo } from "../types";
import { useMarkers } from "../context/MarkerContext";

import { LocationObject, LocationSubscription } from "expo-location";
import { LocationState, requestLocationPermissions, startLocationUpdates, calculateDistance } from "../services/location";

import NotificationManager from "../services/notifications";
import * as Notification from 'expo-notifications';


const PROXIMITY_THRESHOLD = 50;
const notificationManager = new NotificationManager();

export const MapComponent: React.FC = () => {
  const [locationState, setLocationState] = useState<LocationState>({location: null, errorMsg: null});
  const {markers, addMarker} = useMarkers();
  
  useEffect(() => {
    const checkProximity = (
      userLocation: LocationObject,
      markers: MarkerInfo[]
    ) => {
      markers.forEach(marker => {
        const distance = calculateDistance(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          marker.latitude,
          marker.longitude
        );
    
        if (distance <= PROXIMITY_THRESHOLD) {
          notificationManager.showNotification(marker);
        } else {
          notificationManager.removeNotification(marker.id);
        }
      });
    };
    let locationSubscription: LocationSubscription;

    const onLocation = (location: LocationObject) => {
      setLocationState({location: location, errorMsg: null})
      checkProximity(location, markers);
    }

    const setupLocation = async () => {
      try {
        await requestLocationPermissions();
        locationSubscription = await startLocationUpdates(onLocation);
      } catch (error) {
        setLocationState({
          location: null,
          errorMsg: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    };
  
    setupLocation();
  
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [markers]);

  if (locationState.errorMsg) {
    return <Text>{locationState.errorMsg}</Text>;
  }

  if (!locationState.location) {
    return <ActivityIndicator size="large" />;
  }
  
  const handleMapPress = (event: any) => {
    const newMarker = {
      id: markers.length.toString(),
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
      images: [],
    } as MarkerInfo;
    addMarker(newMarker);
  }

  return (
    <MapView
      style={{ flex: 1 }}
      region={{
        ...locationState.location.coords,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      onPress={handleMapPress}
      showsUserLocation
    >
      <MarkerList markers={markers}/>
    </MapView>
  );
};
