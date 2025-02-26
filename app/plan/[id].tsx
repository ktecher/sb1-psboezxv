import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Share } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useAuth } from '../../contexts/auth';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Calendar, Clock, MapPin, Share as ShareIcon, Trash2 } from 'lucide-react-native';
import { format } from 'date-fns';
import type { Database } from '../../types/supabase';

type Plan = Database['public']['Tables']['plans']['Row'] & {
  plan_items: (Database['public']['Tables']['plan_items']['Row'] & {
    places: Database['public']['Tables']['places']['Row']
  })[];
};

export default function PlanDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { session } = useAuth();
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user.id) {
      fetchPlan();
    }
  }, [session, id]);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: planError } = await supabase
        .from('plans')
        .select(`
          *,
          plan_items (
            *,
            places (*)
          )
        `)
        .eq('id', id)
        .single();

      if (planError) throw planError;
      setPlan(data);
    } catch (err) {
      console.error('Error fetching plan:', err);
      setError('Failed to load plan');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!plan) return;

    const planItems = plan.plan_items
      .sort((a, b) => new Date(a.scheduled_for).getTime() - new Date(b.scheduled_for).getTime())
      .map(item => {
        const time = format(new Date(item.scheduled_for), 'h:mm a');
        return `${time} - ${item.places.name} (${item.duration_minutes} min)`;
      })
      .join('\n');

    const message = `${plan.name}\n\nItinerary:\n${planItems}`;

    try {
      await Share.share({
        message,
        title: plan.name,
      });
    } catch (err) {
      console.error('Error sharing plan:', err);
    }
  };

  const handleDelete = async () => {
    if (!plan) return;

    try {
      setLoading(true);
      const { error: deleteError } = await supabase
        .from('plans')
        .delete()
        .eq('id', plan.id);

      if (deleteError) throw deleteError;
      router.replace('/plan');
    } catch (err) {
      console.error('Error deleting plan:', err);
      setError('Failed to delete plan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error || !plan) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error || 'Plan not found'}</Text>
      </View>
    );
  }

  const sortedItems = [...plan.plan_items].sort(
    (a, b) => new Date(a.scheduled_for).getTime() - new Date(b.scheduled_for).getTime()
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: plan.name,
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <ArrowLeft size={24} color="#ffffff" />
            </Pressable>
          ),
          headerRight: () => (
            <View style={styles.headerButtons}>
              <Pressable onPress={handleShare} style={styles.headerButton}>
                <ShareIcon size={24} color="#ffffff" />
              </Pressable>
              <Pressable onPress={handleDelete} style={styles.headerButton}>
                <Trash2 size={24} color="#ff4444" />
              </Pressable>
            </View>
          ),
        }}
      />

      <ScrollView style={styles.content}>
        <View style={styles.dateContainer}>
          <Calendar size={20} color="#666666" />
          <Text style={styles.date}>
            {format(new Date(sortedItems[0]?.scheduled_for || new Date()), 'MMMM d, yyyy')}
          </Text>
        </View>

        <View style={styles.timeline}>
          {sortedItems.map((item, index) => (
            <View key={item.id} style={styles.timelineItem}>
              <View style={styles.timeContainer}>
                <Text style={styles.time}>
                  {format(new Date(item.scheduled_for), 'h:mm a')}
                </Text>
                <Text style={styles.duration}>
                  {item.duration_minutes} min
                </Text>
              </View>

              <View style={styles.itemContent}>
                <View style={styles.itemLine} />
                <View style={styles.itemDot} />
                
                <View style={styles.placeContainer}>
                  <Text style={styles.placeName}>{item.places.name}</Text>
                  {item.places.address && (
                    <View style={styles.addressContainer}>
                      <MapPin size={16} color="#666666" />
                      <Text style={styles.address}>{item.places.address}</Text>
                    </View>
                  )}
                  {item.places.features && item.places.features.length > 0 && (
                    <View style={styles.features}>
                      {item.places.features.slice(0, 2).map((feature, featureIndex) => (
                        <View key={featureIndex} style={styles.feature}>
                          <Text style={styles.featureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
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
  content: {
    flex: 1,
    padding: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  date: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timeContainer: {
    width: 80,
    marginRight: 16,
  },
  time: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  duration: {
    color: '#666666',
    fontSize: 12,
    marginTop: 4,
  },
  itemContent: {
    flex: 1,
    position: 'relative',
  },
  itemLine: {
    position: 'absolute',
    left: 4,
    top: 24,
    bottom: -24,
    width: 2,
    backgroundColor: '#2a2a2a',
  },
  itemDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    marginRight: 12,
  },
  placeContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginLeft: 24,
  },
  placeName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  address: {
    color: '#666666',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
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
  error: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
  },
});