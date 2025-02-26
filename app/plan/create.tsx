import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useAuth } from '../../contexts/auth';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Plus, Search, MapPin, Star, Clock } from 'lucide-react-native';
import SaveButton from '../../components/SaveButton';
import type { Database } from '../../types/supabase';

type Place = Database['public']['Tables']['places']['Row'];

export default function CreatePlanScreen() {
  const { session } = useAuth();
  const router = useRouter();
  const [planName, setPlanName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<(Place & { duration: number })[]>([]);

  const searchPlaces = async (query: string) => {
    try {
      setLoading(true);
      const { data, error: searchError } = await supabase
        .from('places')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(10);

      if (searchError) throw searchError;
      setPlaces(data || []);
    } catch (err) {
      console.error('Error searching places:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlace = (place: Place) => {
    setSelectedPlaces([...selectedPlaces, { ...place, duration: 60 }]);
    setPlaces([]);
    setSearchQuery('');
  };

  const handleUpdateDuration = (placeId: string, duration: number) => {
    setSelectedPlaces(selectedPlaces.map(place => 
      place.id === placeId ? { ...place, duration } : place
    ));
  };

  const handleRemovePlace = (placeId: string) => {
    setSelectedPlaces(selectedPlaces.filter(place => place.id !== placeId));
  };

  const handleCreatePlan = async () => {
    if (!session?.user.id) return;
    if (!planName.trim()) {
      setError('Please enter a plan name');
      return;
    }
    if (selectedPlaces.length === 0) {
      setError('Please add at least one place to your plan');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create the plan
      const { data: plan, error: planError } = await supabase
        .from('plans')
        .insert({
          user_id: session.user.id,
          name: planName.trim(),
        })
        .select()
        .single();

      if (planError) throw planError;

      // Create plan items
      const startTime = new Date();
      startTime.setHours(9, 0, 0, 0); // Start at 9 AM

      const planItems = selectedPlaces.map((place, index) => {
        const itemTime = new Date(startTime);
        if (index > 0) {
          // Add previous durations to get the correct start time
          const previousDurations = selectedPlaces
            .slice(0, index)
            .reduce((total, p) => total + p.duration, 0);
          itemTime.setMinutes(itemTime.getMinutes() + previousDurations);
        }

        return {
          plan_id: plan.id,
          place_id: place.id,
          scheduled_for: itemTime.toISOString(),
          duration_minutes: place.duration,
          order: index,
        };
      });

      const { error: itemsError } = await supabase
        .from('plan_items')
        .insert(planItems);

      if (itemsError) throw itemsError;

      router.replace('/plan');
    } catch (err) {
      console.error('Error creating plan:', err);
      setError('Failed to create plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Create Plan',
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <ArrowLeft size={24} color="#ffffff" />
            </Pressable>
          ),
        }}
      />

      <ScrollView style={styles.content}>
        <TextInput
          style={styles.nameInput}
          placeholder="Plan Name"
          placeholderTextColor="#666666"
          value={planName}
          onChangeText={setPlanName}
        />

        <View style={styles.searchContainer}>
          <Search size={20} color="#666666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search places to add..."
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              if (text.length >= 2) {
                searchPlaces(text);
              } else {
                setPlaces([]);
              }
            }}
          />
        </View>

        {loading && <ActivityIndicator style={styles.loading} color="#007AFF" />}

        {places.length > 0 && (
          <View style={styles.searchResults}>
            {places.map((place) => (
              <Pressable
                key={place.id}
                style={styles.searchResult}>
                <View style={styles.searchResultContent}>
                  <Text style={styles.searchResultTitle}>{place.name}</Text>
                  {place.address && (
                    <View style={styles.addressContainer}>
                      <MapPin size={14} color="#666666" />
                      <Text style={styles.address} numberOfLines={1}>
                        {place.address}
                      </Text>
                    </View>
                  )}
                  <View style={styles.ratingContainer}>
                    <Star size={14} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.rating}>{place.rating.toFixed(1)}</Text>
                  </View>
                </View>
                <View style={styles.searchResultActions}>
                  <SaveButton placeId={place.id} />
                  <Pressable
                    style={styles.addButton}
                    onPress={() => handleAddPlace(place)}>
                    <Plus size={20} color="#007AFF" />
                  </Pressable>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {error && <Text style={styles.error}>{error}</Text>}

        {selectedPlaces.length > 0 && (
          <View style={styles.selectedPlaces}>
            <Text style={styles.sectionTitle}>Selected Places</Text>
            {selectedPlaces.map((place, index) => (
              <View key={place.id} style={styles.selectedPlace}>
                <View style={styles.selectedPlaceHeader}>
                  <Text style={styles.selectedPlaceTitle}>{place.name}</Text>
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => handleRemovePlace(place.id)}>
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </Pressable>
                </View>

                <View style={styles.durationContainer}>
                  <Clock size={16} color="#666666" />
                  <Text style={styles.durationLabel}>Duration:</Text>
                  <TextInput
                    style={styles.durationInput}
                    keyboardType="number-pad"
                    value={place.duration.toString()}
                    onChangeText={(text) => {
                      const duration = parseInt(text) || 60;
                      handleUpdateDuration(place.id, duration);
                    }}
                  />
                  <Text style={styles.durationUnit}>minutes</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.createButton, loading && styles.createButtonDisabled]}
          onPress={handleCreatePlan}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.createButtonText}>Create Plan</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  nameInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
  },
  loading: {
    marginVertical: 16,
  },
  searchResults: {
    gap: 8,
    marginBottom: 16,
  },
  searchResult: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 12,
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
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
  rating: {
    color: '#ffffff',
    fontSize: 12,
    marginLeft: 4,
  },
  error: {
    color: '#ff4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  selectedPlaces: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  selectedPlace: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  selectedPlaceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedPlaceTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  removeButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationLabel: {
    color: '#666666',
    fontSize: 14,
    marginLeft: 8,
    marginRight: 8,
  },
  durationInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 6,
    padding: 8,
    color: '#ffffff',
    width: 60,
    textAlign: 'center',
  },
  durationUnit: {
    color: '#666666',
    fontSize: 14,
    marginLeft: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  createButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  searchResultActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
});