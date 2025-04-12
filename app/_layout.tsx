import { Stack } from "expo-router";
import { MarkerProvider } from "../context/MarkerContext";
import * as Notification from 'expo-notifications';
import { useEffect } from "react";

const Layout : React.FC = () => {
  useEffect(() => {
    const configureNotifications = async () => {
      await Notification.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
  
      const { status } = await Notification.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Notification permissions not granted');
      }
    };
  
    configureNotifications();
  }, []);
  
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