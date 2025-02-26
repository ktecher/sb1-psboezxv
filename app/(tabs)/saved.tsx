import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, ActivityIndicator, TextInput } from 'react-native';
import { useAuth } from '../../contexts/auth';
import { supabase } from '../../lib/supabase';
import { Search, Star, Trash2, MapPin, ArrowRight } from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';
import type { Database } from '../../types/supabase';

type SavedPlace = Database['public']['Tables']['places']['Row'] & {
  saved_places: { id: string }[];
};

const categories = [
  'All',
  'Restaurants & Cafes',
  'Shopping',
  'Cultural Sites',
  'Entertainment',
  'Events',
  'Kids Activity'
];

export default function SavedScreen() {
  const { session } = useAuth();
  const router = useRouter();
  const [places, setPlaces] = useState<SavedPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    if (!session?.user.id) return;
    fetchSavedPlaces();
  }, [session]);

  const fetchSavedPlaces = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('places')
        .select(`
          *,
          saved_places!inner (id)
        `)
        .eq('saved_places.user_id', session?.user.id);

      if (error) throw error;
      setPlaces(data || []);
    } catch (err) {
      setError('Failed to load saved places');
    } finally {
      setLoading(false);
    }
  };

  const removeSavedPlace = async (placeId: string) => {
    try {
      const { error } = await supabase
        .from('saved_places')
        .delete()
        .eq('place_id', placeId)
        .eq('user_id', session?.user.id);

      if (error) throw error;
      setPlaces(places.filter(place => place.id !== placeId));
    } catch (err) {
      setError('Failed to remove place');
    }
  };

  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (place.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || place.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!session) {
    return (
      <View style={styles.container}>
        <View style={styles.unauthenticatedContent}>
          <Text style={styles.title}>Saved Places</Text>
          <Text style={styles.subtitle}>Sign in to view your saved places</Text>
          
          <Link href="/auth/sign-in" asChild>
            <Pressable style={styles.signInButton}>
              <Text style={styles.signInButtonText}>Sign In</Text>
              <ArrowRight size={20} color="#ffffff" />
            </Pressable>
          </Link>

          <Text style={styles.noAccountText}>Don't have an account?</Text>
          <Link href="/auth/sign-up" asChild>
            <Pressable style={styles.signUpButton}>
              <Text style={styles.signUpButtonText}>Create Account</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Places</Text>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search saved places..."
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item}
        style={styles.categoriesContainer}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.categoryButton,
              selectedCategory === item && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(item)}>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item && styles.categoryTextActive
              ]}>
              {item}
            </Text>
          </Pressable>
        )}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={filteredPlaces}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No saved places found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable 
            style={styles.placeCard}
            onPress={() => router.push(`/place/${item.id}`)}>
            <Image
              source={{ uri: item.images?.[0] || 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&h=600&fit=crop' }}
              style={styles.placeImage}
            />
            <View style={styles.placeInfo}>
              <View>
                <Text style={styles.placeName}>{item.name}</Text>
                <View style={styles.placeDetails}>
                  <MapPin size={16} color="#666666" />
                  <Text style={styles.placeAddress} numberOfLines={1}>
                    {item.address || 'No address available'}
                  </Text>
                </View>
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
                </View>
              </View>
              <Pressable
                style={styles.removeButton}
                onPress={() => removeSavedPlace(item.id)}>
                <Trash2 size={20} color="#ff4444" />
              </Pressable>
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
  header: {
    padding: 16,
    paddingTop: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    color: '#666666',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  listContent: {
    padding: 16,
  },
  placeCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  placeImage: {
    width: '100%',
    height: 200,
  },
  placeInfo: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  placeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeAddress: {
    color: '#666666',
    fontSize: 14,
    marginLeft: 4,
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
  removeButton: {
    padding: 8,
  },
  error: {
    color: '#ff4444',
    fontSize: 14,
    textAlign: 'center',
    margin: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
  },
  unauthenticatedContent: {
    flex: 1,
    padding: 16,
    paddingTop: 48,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
  },
  signInButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  noAccountText: {
    color: '#666666',
    fontSize: 14,
    marginBottom: 8,
  },
  signUpButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  signUpButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});