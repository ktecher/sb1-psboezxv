import { View, Text, StyleSheet, FlatList, Image, Pressable, ActivityIndicator, TextInput } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Star, MapPin, Search, ArrowUpDown } from 'lucide-react-native';
import type { Database } from '../../types/supabase';

type Place = Database['public']['Tables']['places']['Row'];

const categoryMapping: Record<string, string> = {
  'restaurants': 'Restaurants & Cafes',
  'shopping': 'Shopping',
  'cultural': 'Cultural Sites',
  'entertainment': 'Entertainment',
  'events': 'Events',
  'kids': 'Kids Activity'
};

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'name'>('rating');

  const fetchPlaces = async (searchTerm = '') => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('places')
        .select('*');

      if (id === 'top-rated') {
        query = query.order('rating', { ascending: false }).limit(20);
      } else if (id === 'summer' || id === 'winter') {
        query = query.eq('seasonal', id);
      } else {
        const categoryName = categoryMapping[id as string];
        if (categoryName) {
          query = query.eq('category', categoryName);
        }
      }

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      if (sortBy === 'name') {
        query = query.order('name');
      } else {
        query = query.order('rating', { ascending: false });
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;
      setPlaces(data || []);
    } catch (err) {
      console.error('Error fetching places:', err);
      setError('Failed to load places');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, [id, sortBy]);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    fetchPlaces(text);
  }, []);

  const getCategoryTitle = () => {
    if (id === 'top-rated') return 'Top Rated Places';
    if (id === 'summer') return 'Summer Activities';
    if (id === 'winter') return 'Winter Activities';
    return categoryMapping[id as string] || 'Places';
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: getCategoryTitle(),
          headerStyle: {
            backgroundColor: '#121212',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search places..."
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <Pressable
            style={styles.sortButton}
            onPress={() => setSortBy(prev => prev === 'rating' ? 'name' : 'rating')}>
            <ArrowUpDown size={20} color="#666666" />
          </Pressable>
        </View>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loading} />
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No places found</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/place/${item.id}`)}>
              <Image
                source={{
                  uri: item.images?.[0] ||
                    'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&h=600&fit=crop'
                }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                {item.address && (
                  <View style={styles.addressContainer}>
                    <MapPin size={16} color="#666666" />
                    <Text style={styles.address} numberOfLines={1}>
                      {item.address}
                    </Text>
                  </View>
                )}
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
                </View>
                {item.features && item.features.length > 0 && (
                  <View style={styles.features}>
                    {item.features.slice(0, 2).map((feature, index) => (
                      <View key={index} style={styles.feature}>
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </Pressable>
          )}
        />
      )}
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
  error: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
    margin: 16,
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    color: '#ffffff',
    marginLeft: 4,
    fontSize: 14,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  feature: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  featureText: {
    color: '#666666',
    fontSize: 12,
  },
  loading: {
    marginTop: 32,
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