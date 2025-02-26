import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useAuth } from '../../contexts/auth';
import { supabase } from '../../lib/supabase';
import { MapPin, Navigation } from 'lucide-react-native';
import * as Location from 'expo-location';
import type { Database } from '../../types/supabase';

type Place = Database['public']['Tables']['places']['Row'];

export default function MapScreen() {
  const { session } = useAuth();
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    fetchPlaces();
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (err) {
      console.error('Error getting location:', err);
    }
  };

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: placesError } = await supabase
        .from('places')
        .select('*');

      if (placesError) throw placesError;
      setPlaces(data || []);
    } catch (err) {
      console.error('Error fetching places:', err);
      setError('Failed to load places');
    } finally {
      setLoading(false);
    }
  };

  const handleGetDirections = (place: Place) => {
    if (!place.coordinates) return;
    
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates[1]},${place.coordinates[0]}`;
    Linking.openURL(url);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation?.latitude || 29.3759,
          longitude: userLocation?.longitude || 47.9774,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={!!userLocation}>
        {places.map((place) => (
          place.coordinates && (
            <Marker
              key={place.id}
              coordinate={{
                latitude: place.coordinates[1],
                longitude: place.coordinates[0],
              }}
              title={place.name}>
              <MapPin size={24} color="#007AFF" />
              <Callout
                tooltip
                onPress={() => router.push(`/place/${place.id}`)}>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{place.name}</Text>
                  {place.address && (
                    <Text style={styles.calloutAddress}>{place.address}</Text>
                  )}
                  <View style={styles.calloutActions}>
                    <Pressable
                      style={styles.calloutButton}
                      onPress={() => router.push(`/place/${place.id}`)}>
                      <Text style={styles.calloutButtonText}>View Details</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.calloutButton, styles.calloutButtonSecondary]}
                      onPress={() => handleGetDirections(place)}>
                      <Navigation size={16} color="#007AFF" />
                      <Text style={styles.calloutButtonTextSecondary}>
                        Directions
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </Callout>
            </Marker>
          )
        ))}
      </MapView>
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
  map: {
    flex: 1,
  },
  callout: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    minWidth: 200,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  calloutAddress: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  calloutActions: {
    flexDirection: 'row',
    gap: 8,
  },
  calloutButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  calloutButtonSecondary: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  calloutButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  calloutButtonTextSecondary: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
});