import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ActivityIndicator, FlatList } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useAuth } from '../../contexts/auth';
import { supabase } from '../../lib/supabase';
import { CircleUser as UserCircle2, MapPin, Calendar, ArrowLeft } from 'lucide-react-native';

type UserProfile = {
  id: string;
  username: string;
  avatar_url: string | null;
  followers_count: number;
  following_count: number;
  reviews_count: number;
};

type Activity = {
  id: string;
  type: 'review' | 'plan' | 'save';
  created_at: string;
  place: {
    id: string;
    name: string;
    address: string | null;
    images: string[] | null;
  };
};

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const { session } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (profileError) throw profileError;

      // Check if current user is following
      if (session?.user.id) {
        const { data: followData } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_id', session.user.id)
          .eq('following_id', id)
          .single();

        setIsFollowing(!!followData);
      }

      // Fetch recent activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('user_activities')
        .select(`
          id,
          type,
          created_at,
          places (
            id,
            name,
            address,
            images
          )
        `)
        .eq('user_id', id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (activitiesError) throw activitiesError;

      setProfile(profileData);
      setActivities(activitiesData || []);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!session?.user.id) {
      router.push('/auth/sign-in');
      return;
    }

    try {
      if (isFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', session.user.id)
          .eq('following_id', id);
      } else {
        await supabase
          .from('follows')
          .insert({
            follower_id: session.user.id,
            following_id: id
          });
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Error toggling follow:', err);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error || 'User not found'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: profile.username,
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <ArrowLeft size={24} color="#ffffff" />
            </Pressable>
          ),
        }}
      />

      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <>
            <View style={styles.header}>
              <Image
                source={{
                  uri: profile.avatar_url ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop'
                }}
                style={styles.avatar}
              />
              <Text style={styles.username}>{profile.username}</Text>

              <View style={styles.stats}>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{profile.reviews_count}</Text>
                  <Text style={styles.statLabel}>Reviews</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{profile.followers_count}</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{profile.following_count}</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
              </View>

              {session?.user.id !== id && (
                <Pressable
                  style={[styles.followButton, isFollowing && styles.followingButton]}
                  onPress={handleFollow}>
                  <Text style={styles.followButtonText}>
                    {isFollowing ? 'Following' : 'Follow'}
                  </Text>
                </Pressable>
              )}
            </View>

            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </>
        )}
        renderItem={({ item }) => (
          <Pressable
            style={styles.activityCard}
            onPress={() => router.push(`/place/${item.place.id}`)}>
            <Image
              source={{
                uri: item.place.images?.[0] ||
                  'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&h=600&fit=crop'
              }}
              style={styles.activityImage}
            />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{item.place.name}</Text>
              {item.place.address && (
                <View style={styles.addressContainer}>
                  <MapPin size={14} color="#666666" />
                  <Text style={styles.address} numberOfLines={1}>
                    {item.place.address}
                  </Text>
                </View>
              )}
              <View style={styles.activityMeta}>
                <Calendar size={14} color="#666666" />
                <Text style={styles.activityDate}>
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
                <Text style={styles.activityType}>
                  {item.type === 'review' ? 'Reviewed' :
                   item.type === 'plan' ? 'Planned Visit' : 'Saved'}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  error: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  followButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 20,
  },
  followingButton: {
    backgroundColor: '#2a2a2a',
  },
  followButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  activityCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  activityImage: {
    width: '100%',
    height: 160,
  },
  activityContent: {
    padding: 16,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  address: {
    color: '#666666',
    fontSize: 14,
    marginLeft: 4,
    flex: 1,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activityDate: {
    color: '#666666',
    fontSize: 14,
  },
  activityType: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
});