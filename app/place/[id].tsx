import { View, Text, StyleSheet, Image, ScrollView, Pressable, ActivityIndicator, Linking } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Star, MapPin, Clock, Phone, Globe } from 'lucide-react-native';
import { useAuth } from '../../contexts/auth';
import SaveButton from '../../components/SaveButton';
import type { Database } from '../../types/supabase';

type Place = Database['public']['Tables']['places']['Row'];
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

export default function PlaceScreen() {
  const { id } = useLocalSearchParams();
  const { session } = useAuth();
  const router = useRouter();
  const [place, setPlace] = useState<Place | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchPlaceDetails();
  }, [id]);

  const fetchPlaceDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch place details
      const { data: placeData, error: placeError } = await supabase
        .from('places')
        .select('*')
        .eq('id', id)
        .single();

      if (placeError) throw placeError;

      // Check if place is saved
      if (session?.user.id) {
        const { data: savedData } = await supabase
          .rpc('get_saved_place', { 
            place_id_param: id, 
            user_id_param: session.user.id 
          });

        setIsSaved(!!savedData?.[0]);
      }

      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .rpc('get_reviews_with_users', { place_id_param: id });

      if (reviewsError) throw reviewsError;

      setPlace(placeData);
      setReviews(reviewsData || []);
    } catch (err) {
      setError('Failed to load place details');
      console.error('Error fetching place details:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error || !place) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error || 'Place not found'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: place.name,
          headerStyle: {
            backgroundColor: '#121212',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => (
            session?.user.id ? (
              <SaveButton placeId={place.id} initialSaved={isSaved} />
            ) : null
          ),
        }}
      />
      <ScrollView>
        <Image
          source={{
            uri: place.images?.[0] ||
              'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&h=600&fit=crop'
          }}
          style={styles.headerImage}
        />

        <View style={styles.content}>
          <View style={styles.ratingContainer}>
            <Star size={20} color="#FFD700" fill="#FFD700" />
            <Text style={styles.rating}>{place.rating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>({reviews.length} reviews)</Text>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <MapPin size={20} color="#666666" />
              <Text style={styles.infoText}>{place.address || 'No address available'}</Text>
            </View>

            {place.opening_hours && (
              <View style={styles.infoItem}>
                <Clock size={20} color="#666666" />
                <Text style={styles.infoText}>
                  {JSON.stringify(place.opening_hours)}
                </Text>
              </View>
            )}

            {place.contact_info && (
              <>
                {(place.contact_info as any).phone && (
                  <Pressable
                    style={styles.infoItem}
                    onPress={() => Linking.openURL(`tel:${(place.contact_info as any).phone}`)}>
                    <Phone size={20} color="#666666" />
                    <Text style={[styles.infoText, styles.link]}>
                      {(place.contact_info as any).phone}
                    </Text>
                  </Pressable>
                )}

                {(place.contact_info as any).website && (
                  <Pressable
                    style={styles.infoItem}
                    onPress={() => Linking.openURL((place.contact_info as any).website)}>
                    <Globe size={20} color="#666666" />
                    <Text style={[styles.infoText, styles.link]}>
                      Visit Website
                    </Text>
                  </Pressable>
                )}
              </>
            )}
          </View>

          {place.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{place.description}</Text>
            </View>
          )}

          {place.features && place.features.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Features</Text>
              <View style={styles.features}>
                {place.features.map((feature, index) => (
                  <View key={index} style={styles.feature}>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <View key={review.id} style={styles.review}>
                  <View style={styles.reviewHeader}>
                    <Image
                      source={{
                        uri: review.avatar_url ||
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop'
                      }}
                      style={styles.avatar}
                    />
                    <View style={styles.reviewHeaderText}>
                      <Text style={styles.username}>
                        {review.username || 'Anonymous'}
                      </Text>
                      <Text style={styles.date}>
                        {formatDate(review.created_at)}
                      </Text>
                    </View>
                    <View style={styles.reviewRating}>
                      <Star size={16} color="#FFD700" fill="#FFD700" />
                      <Text style={styles.reviewRatingText}>
                        {review.rating.toFixed(1)}
                      </Text>
                    </View>
                  </View>
                  {review.content && (
                    <Text style={styles.reviewContent}>{review.content}</Text>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.noReviews}>No reviews yet</Text>
            )}
          </View>
        </View>
      </ScrollView>
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
  headerImage: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  reviewCount: {
    color: '#666666',
    fontSize: 16,
    marginLeft: 8,
  },
  infoContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    color: '#ffffff',
    fontSize: 16,
    flex: 1,
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  description: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 24,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  feature: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  featureText: {
    color: '#ffffff',
    fontSize: 14,
  },
  review: {
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
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRatingText: {
    color: '#ffffff',
    marginLeft: 4,
    fontSize: 14,
  },
  reviewContent: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 24,
  },
  noReviews: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});