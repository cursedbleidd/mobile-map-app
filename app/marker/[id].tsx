import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import MarkerCard from "../../components/MarkerCard";

const MarkerDetail : React.FC = () => {
  const params = useLocalSearchParams<{
    id: string;
  }>();

  return (
    <MarkerCard id={params.id} />
  );
}

export default MarkerDetail;