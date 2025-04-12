import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { MapComponent } from '../components/MapComponent';

const App : React.FC = () => {
  return (
    <View style={styles.container}>
      
      <MapComponent/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;