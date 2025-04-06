import React, { useEffect, useState } from "react";
import { Text, ActivityIndicator } from "react-native";
import { LocationObject, requestForegroundPermissionsAsync, getCurrentPositionAsync } from "expo-location";
import MapView from "react-native-maps";
import { MarkerList } from "./MarkerList";
import { MarkerInfo } from "../constrains/types";
import { useMarkers } from "../context/MarkerContext";
import { v4 as uuidv4 } from 'uuid';

export const MapComponent: React.FC = () => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const {markers, addMarker} = useMarkers();

  useEffect(() => {
    (async () => {
      const { status } = await requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const loc = await getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  if (!location) {
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
      initialRegion={{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      onPress={handleMapPress}
      followsUserLocation={true}
      showsUserLocation={true}
    >
      <MarkerList markers={markers}/>
    </MapView>
  );
};
