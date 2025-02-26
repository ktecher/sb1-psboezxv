import { View, Text, StyleSheet, FlatList, Image, Pressable, ActivityIndicator, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Star, MapPin, Search, ArrowUpDown } from 'lucide-react-native';
import type { Database } from '../../types/supabase';

type Review = {
  id: string;
  place_id: string;
  user_id: string;
  rating: number;
  content: string | null;
  created_at: string;
  updated_at: string;
  username: string | null;
  avatar_url: string | null;
};

export default function PlaceReviewsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'date'>('date');

  useEffect(() => {
    fetchReviews();
  }, [id, sortBy]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: reviewsError } = await supabase
        .rpc('get_reviews_with_users', { place_id_param: id });

      if (reviewsError) throw reviewsError;
      setReviews(data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review =>
    review.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Reviews',
          headerStyle: {
            backgroundColor: '#121212',
          },
          headerTintColor: '#ffffff',
        }}
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reviews..."
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Pressable
            style={styles.sortButton}
            onPress={() => setSortBy(prev => prev === 'date' ? 'rating' : 'date')}>
            <ArrowUpDown size={20} color="#666666" />
          </Pressable>
        </View>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={filteredReviews}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No reviews found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image
                source={{
                  uri: item.avatar_url ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
                }}
                style={styles.avatar}
              />
              <View style={styles.reviewHeaderText}>
                <Text style={styles.username}>{item.username || 'Anonymous'}</Text>
                <Text style={styles.date}>{formatDate(item.created_at)}</Text>
              </View>
              <View style={styles.ratingContainer}>
                <Star size={16} color="#FFD700" fill="#FFD700" />
                <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
              </View>
            </View>
            {item.content && (
              <Text style={styles.reviewContent}>{item.content}</Text>
            )}
          </View>
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
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
  },
  sortButton: {
    padding: 4,
  },
  listContent: {
    padding: 16,
  },
  reviewCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewHeaderText: {
    flex: 1,
  },
  username: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    color: '#666666',
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#ffffff',
    marginLeft: 4,
    fontSize: 14,
  },
  reviewContent: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 24,
  },
  error: {
    color: '#ff4444',
    fontSize: 14,
    textAlign: 'center',
    margin: 16,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
  },
});