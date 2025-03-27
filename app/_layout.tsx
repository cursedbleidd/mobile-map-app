import { Stack } from "expo-router";
import { MarkerProvider } from "../context/MarkerContext";

const Layout : React.FC = () => {
  return (
    <MarkerProvider>
    <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }}/>
        <Stack.Screen name="marker/[id]" options={{ headerTitle: "" }}/>
    </Stack>
    </MarkerProvider>
    );
}
export default Layout;