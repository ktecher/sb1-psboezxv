import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../contexts/auth';
import { supabase } from '../../lib/supabase';
import { Bell, CircleUser as UserCircle2, Star, Calendar, MapPin } from 'lucide-react-native';

type Notification = {
  id: string;
  type: 'follow' | 'review' | 'plan' | 'like';
  created_at: string;
  read: boolean;
  data: {
    user?: {
      id: string;
      username: string;
      avatar_url: string | null;
    };
    place?: {
      id: string;
      name: string;
      address: string | null;
    };
    plan?: {
      id: string;
      name: string;
    };
  };
};

export default function NotificationsScreen() {
  const { session } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user.id) {
      fetchNotifications();
    }
  }, [session]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session?.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    markAsRead(notification.id);

    switch (notification.type) {
      case 'follow':
        if (notification.data.user) {
          router.push(`/social/${notification.data.user.id}`);
        }
        break;
      case 'review':
      case 'like':
        if (notification.data.place) {
          router.push(`/place/${notification.data.place.id}`);
        }
        break;
      case 'plan':
        if (notification.data.plan) {
          router.push(`/plan/${notification.data.plan.id}`);
        }
        break;
    }
  };

  const renderNotification = ({ item: notification }: { item: Notification }) => {
    const getNotificationContent = () => {
      switch (notification.type) {
        case 'follow':
          return {
            icon: <UserCircle2 size={24} color="#007AFF" />,
            message: `${notification.data.user?.username} started following you`
          };
        case 'review':
          return {
            icon: <Star size={24} color="#FFD700" />,
            message: `${notification.data.user?.username} reviewed ${notification.data.place?.name}`
          };
        case 'plan':
          return {
            icon: <Calendar size={24} color="#007AFF" />,
            message: `Upcoming visit to ${notification.data.place?.name}`
          };
        case 'like':
          return {
            icon: <Star size={24} color="#FF69B4" />,
            message: `${notification.data.user?.username} liked your review of ${notification.data.place?.name}`
          };
        default:
          return {
            icon: <Bell size={24} color="#666666" />,
            message: 'New notification'
          };
      }
    };

    const { icon, message } = getNotificationContent();

    return (
      <Pressable
        style={[styles.notification, !notification.read && styles.unread]}
        onPress={() => handleNotificationPress(notification)}>
        {notification.data.user?.avatar_url ? (
          <Image
            source={{ uri: notification.data.user.avatar_url }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.iconContainer}>{icon}</View>
        )}
        <View style={styles.content}>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.time}>
            {new Date(notification.created_at).toLocaleDateString()}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Notifications' }} />
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Bell size={48} color="#666666" />
            <Text style={styles.emptyStateText}>No notifications yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  list: {
    padding: 16,
  },
  notification: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  unread: {
    backgroundColor: '#1a1a1a',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  message: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 4,
  },
  time: {
    color: '#666666',
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    color: '#666666',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});