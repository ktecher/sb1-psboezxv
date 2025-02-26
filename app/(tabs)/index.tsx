import { View, Text, ScrollView, StyleSheet, Image, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { Search, Star, MapPin, Calendar } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import type { Database } from '../../types/supabase';

type Place = Database['public']['Tables']['places']['Row'];

const categories = [
  { id: 'events', name: 'Events' },
  { id: 'restaurants', name: 'Restaurants' },
  { id: 'shopping', name: 'Shopping' },
  { id: 'cultural', name: 'Cultural' },
  { id: 'entertainment', name: 'Entertainment' },
];

export default function DiscoverScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSeason, setCurrentSeason] = useState<'summer' | 'winter' | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const month = new Date().getMonth() + 1;
    if (month >= 4 && month <= 10) {
      setCurrentSeason('summer');
    } else {
      setCurrentSeason('winter');
    }

    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: placesData, error: placesError } = await supabase
        .from('places')
        .select('*');

      if (placesError) throw placesError;
      setPlaces(placesData || []);
    } catch (err) {
      setError('Failed to load places');
    } finally {
      setLoading(false);
    }
  };

  const latestEvents = places
    .filter(place => place.category === 'Events')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const topRatedPlaces = places
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const seasonalPlaces = places
    .filter(place => place.seasonal === currentSeason)
    .slice(0, 5);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
        <Pressable 
          style={styles.retryButton}
          onPress={fetchPlaces}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666666" style={styles.searchIcon} />
          <TextInput
            placeholder="Search activities, places..."
            placeholderTextColor="#666666"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}>
        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={styles.categoryButton}
            onPress={() => router.push(`/category/${category.id}`)}>
            <Text style={styles.categoryText}>{category.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {latestEvents.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Events</Text>
            <Pressable onPress={() => router.push('/category/events')}>
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsContainer}>
            {latestEvents.map((event) => (
              <Pressable
                key={event.id}
                style={styles.eventCard}
                onPress={() => router.push(`/place/${event.id}`)}>
                <Image 
                  source={{ 
                    uri: event.images?.[0] || 
                      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop'
                  }} 
                  style={styles.eventImage} 
                />
                <View style={styles.eventContent}>
                  <Calendar size={16} color="#007AFF" />
                  <Text style={styles.eventTitle} numberOfLines={2}>{event.name}</Text>
                  {event.address && (
                    <View style={styles.addressContainer}>
                      <MapPin size={14} color="#666666" />
                      <Text style={styles.address} numberOfLines={1}>
                        {event.address}
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Places</Text>
          <Pressable onPress={() => router.push('/category/top-rated')}>
            <Text style={styles.seeAll}>See All</Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}>
          {topRatedPlaces.map((place) => (
            <Pressable
              key={place.id}
              style={styles.card}
              onPress={() => router.push(`/place/${place.id}`)}>
              <Image 
                source={{ 
                  uri: place.images?.[0] || 
                    'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&h=600&fit=crop'
                }} 
                style={styles.cardImage} 
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>{place.name}</Text>
                {place.address && (
                  <View style={styles.addressContainer}>
                    <MapPin size={14} color="#666666" />
                    <Text style={styles.address} numberOfLines={1}>
                      {place.address}
                    </Text>
                  </View>
                )}
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.ratingText}>{place.rating.toFixed(1)}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {seasonalPlaces.length > 0 && (
        <View style={[styles.section, styles.seasonalSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {currentSeason === 'summer' ? 'Summer Activities' : 'Winter Activities'}
            </Text>
            <Pressable onPress={() => router.push(`/category/${currentSeason}`)}>
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsContainer}>
            {seasonalPlaces.map((place) => (
              <Pressable
                key={place.id}
                style={styles.card}
                onPress={() => router.push(`/place/${place.id}`)}>
                <Image 
                  source={{ 
                    uri: place.images?.[0] || 
                      'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&h=600&fit=crop'
                  }} 
                  style={styles.cardImage} 
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{place.name}</Text>
                  {place.address && (
                    <View style={styles.addressContainer}>
                      <MapPin size={14} color="#666666" />
                      <Text style={styles.address} numberOfLines={1}>
                        {place.address}
                      </Text>
                    </View>
                  )}
                  <View style={styles.ratingContainer}>
                    <Star size={16} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.ratingText}>{place.rating.toFixed(1)}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
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
    padding: 16,
  },
  error: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
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
    paddingBottom: 16,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 14,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  seasonalSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  seeAll: {
    color: '#666666',
    fontSize: 14,
  },
  cardsContainer: {
    gap: 16,
  },
  eventCard: {
    width: 280,
    marginRight: 16,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 160,
  },
  eventContent: {
    padding: 12,
    gap: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 4,
  },
  card: {
    width: 240,
    marginRight: 16,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  address: {
    color: '#666666',
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#ffffff',
    marginLeft: 4,
    fontSize: 14,
  },
});