import { View, Text, TextInput, StyleSheet } from "react-native";
import { ImageList } from "../components/ImageList";
import { useMarkers } from "../context/MarkerContext";
import { ActivityIndicator } from "react-native";
import { useState } from "react";
import { MarkerInfo } from "../types";

type MarkerCardProps = {
    id: string;
}

const MarkerCard : React.FC<MarkerCardProps> = ({ id }) => {
  const { markers, updateMarker } = useMarkers();
  const marker = markers.find((marker) => marker.id === id);

  const textChanged = (text: string, field: 'title' | 'description') => {
    if (marker) {
      updateMarker({
        ...marker,
        title: field === 'title'? text : marker.title,
        description: field === 'description' ? text : marker.description,
      });
    }
  }

  return (
    marker ?
    <View style={styles.container}>
      <Text>Marker Details</Text>
      <Text>ID: {marker.id}</Text>
      <TextInput
        defaultValue={marker.title}
        style={styles.input}
        onChangeText={text => textChanged(text, 'title')}
      />
      <TextInput
        defaultValue={marker.description}
        style={styles.input}
        onChangeText={text => textChanged(text, 'description')}
      />
      <Text>Latitude: {marker.latitude}</Text>
      <Text>Longitude: {marker.longitude}</Text>
      <ImageList marker={marker}/>
    </View>
    :
    <ActivityIndicator size="large" />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  }
});


export default MarkerCard;