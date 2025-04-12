import * as Notification from 'expo-notifications'
import { MarkerInfo } from '../types';

interface ActiveNotification {
    markerId: string;
    notificationId: string;
    timestamp: number;
}
  
export default class NotificationManager {
  private activeNotifications: Map<string, ActiveNotification>;

  constructor() {
    this.activeNotifications = new Map();
  }

  async showNotification(marker: MarkerInfo): Promise<void> {
    try
    {
    if (this.activeNotifications.has(marker.id)) {
      return; // Предотвращаем дубликаты
    }
    console.log(this.activeNotifications.keys());
    const notificationId = await Notification.scheduleNotificationAsync({
      content: {
        title: "Вы рядом с меткой !",
        body: `Вы находитесь рядом с сохранённой точкой. ${marker.title}`,
      },
      trigger: null
    });

    this.activeNotifications.set(
      marker.id,
      {
        markerId: marker.id,
        notificationId,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  async removeNotification(markerId: string): Promise<void> {
    const notification = this.activeNotifications.get(markerId);
    if (notification) {
      try {
        await Notification.cancelScheduledNotificationAsync(notification.notificationId);
      }
      catch (error) {
        console.error('Error removing notification:', error);
      }
      this.activeNotifications.delete(markerId);
    }
  }
}