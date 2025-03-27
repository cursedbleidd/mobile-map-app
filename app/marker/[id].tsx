import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { ImageList } from "../../components/ImageList";

const MarkerDetail : React.FC = () => {
  const marker = useLocalSearchParams<{
    id: string;
    latitude: string;
    longitude: string;
  }>();

  return (
    <View style={styles.container}>
      <Text>Marker Details</Text>
      <Text>ID: {marker.id}</Text>
      <Text>Latitude: {marker.latitude}</Text>
      <Text>Longitude: {marker.longitude}</Text>
      <ImageList marker={marker}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


export default MarkerDetail;