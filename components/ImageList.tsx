import { FlatList, View, Button, Image } from "react-native"
import { launchImageLibraryAsync} from 'expo-image-picker';
import { MarkerInfo } from "../types";
import { useMarkers } from "../context/MarkerContext";

export type ImageListProps = {
  marker: MarkerInfo,
}

export const ImageList : React.FC<ImageListProps> = ({marker}) => {

    const { updateMarker } = useMarkers();

    const pickImages = async () => {
      const result = await launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsMultipleSelection: true,
        quality: 1,
      })
  
      if (!result.canceled) {
        const newImages = result.assets.map(img => img.uri)
        updateMarker({
          ...marker,
          images: [...marker.images, ...newImages]
        })
      }
    } 
    const removeImage = (imageUri: string) => {
      const updatedImages = marker.images.filter((uri) => uri !== imageUri);
      updateMarker({
        ...marker,
        images: updatedImages,
      });
    }

    return (
      <>
      <Button title="Add Images" onPress={pickImages} />
      <FlatList
      data={marker.images}
      keyExtractor={(imageUri) => imageUri}
      numColumns={2}
      renderItem={({ item }) => (
        <View style={{ width: '50%', padding: 10}}>
          <Image source={{ uri: item }} style={{ minWidth: 150, minHeight: 150, borderRadius: 20, margin: 5 }}/>
          <Button title="❌" onPress={() => removeImage(item)}/>
        </View>
      )}
      />
      </>
    )
}