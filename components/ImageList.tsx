import { FlatList, View, Button, Image } from "react-native"
import { launchImageLibraryAsync} from 'expo-image-picker';
import { useMarkerImages } from "../context/MarkerContext";

export type ImageListProps = {
  marker: {
    id: string,
    latitude: string,
    longitude: string,
  }
}

export const ImageList : React.FC<ImageListProps> = ({marker}) => {

    const { markerImages, addImages, removeImage } = useMarkerImages();

    const pickImages = async () => {
      const result = await launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsMultipleSelection: true,
        quality: 1,
      })
  
      if (!result.canceled) {
        const newImages = result.assets.map(img => img.uri)
        addImages(marker.id, newImages);
      }
    } 

    return (
      <>
      <Button title="Add Images" onPress={pickImages} />
      <FlatList
      data={markerImages[marker.id] || []}
      keyExtractor={(item) => item}
      numColumns={2}
      renderItem={({ item }) => (
        <View style={{ width: '50%', padding: 10}}>
          <Image source={{ uri: item }} style={{ minWidth: 150, minHeight: 150, borderRadius: 20, margin: 5 }}/>
          <Button title="❌" onPress={() => removeImage(marker.id, item)}/>
        </View>
      )}
      />
      </>
    )
}