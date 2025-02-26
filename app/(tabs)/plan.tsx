import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, TextInput } from 'react-native';
import { useAuth } from '../../contexts/auth';
import { supabase } from '../../lib/supabase';
import { Link, useRouter } from 'expo-router';
import { Calendar as CalendarIcon, Plus, Clock, MapPin, ArrowRight } from 'lucide-react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { format } from 'date-fns';
import type { Database } from '../../types/supabase';

type Plan = Database['public']['Tables']['plans']['Row'] & {
  plan_items: (Database['public']['Tables']['plan_items']['Row'] & {
    places: Database['public']['Tables']['places']['Row']
  })[];
};

export default function PlanScreen() {
  const { session } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (session?.user.id) {
      fetchPlans();
    }
  }, [session]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: plansError } = await supabase
        .from('plans')
        .select(`
          *,
          plan_items (
            *,
            places (*)
          )
        `)
        .eq('user_id', session?.user.id)
        .order('created_at', { ascending: false });

      if (plansError) throw plansError;
      setPlans(data || []);
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const getPlannedItemsForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return plans.flatMap(plan => 
      plan.plan_items.filter(item => 
        format(new Date(item.scheduled_for), 'yyyy-MM-dd') === dateString
      )
    ).sort((a, b) => 
      new Date(a.scheduled_for).getTime() - new Date(b.scheduled_for).getTime()
    );
  };

  if (!session) {
    return (
      <View style={styles.container}>
        <View style={styles.unauthenticatedContent}>
          <Text style={styles.title}>Plan Your Visit</Text>
          <Text style={styles.subtitle}>Sign in to create and manage your plans</Text>
          
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

  const plannedItems = getPlannedItemsForDate(selectedDate);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Plans</Text>
        <Pressable
          style={styles.createButton}
          onPress={() => router.push('/plan/create')}>
          <Plus size={24} color="#ffffff" />
        </Pressable>
      </View>

      <CalendarStrip
        style={styles.calendar}
        calendarColor="#2a2a2a"
        highlightDateNumberStyle={{ color: '#ffffff' }}
        highlightDateNameStyle={{ color: '#ffffff' }}
        dateNumberStyle={{ color: '#666666' }}
        dateNameStyle={{ color: '#666666' }}
        selectedDate={selectedDate}
        onDateSelected={setSelectedDate}
        scrollable
        upperCaseDays={false}
        styleWeekend
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={plannedItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <CalendarIcon size={48} color="#666666" />
            <Text style={styles.emptyStateTitle}>No Plans for This Day</Text>
            <Text style={styles.emptyStateText}>
              Create a new plan to start organizing your visit
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.planItem}>
            <View style={styles.timeContainer}>
              <Clock size={16} color="#666666" />
              <Text style={styles.time}>
                {format(new Date(item.scheduled_for), 'h:mm a')}
              </Text>
              <Text style={styles.duration}>
                ({item.duration_minutes} min)
              </Text>
            </View>

            <View style={styles.placeContainer}>
              <Text style={styles.placeName}>{item.places.name}</Text>
              <View style={styles.placeDetails}>
                <MapPin size={16} color="#666666" />
                <Text style={styles.placeAddress} numberOfLines={1}>
                  {item.places.address || 'No address available'}
                </Text>
              </View>
            </View>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  createButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendar: {
    height: 100,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#2a2a2a',
  },
  listContent: {
    padding: 16,
  },
  planItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  time: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 8,
  },
  duration: {
    color: '#666666',
    fontSize: 14,
    marginLeft: 8,
  },
  placeContainer: {
    gap: 8,
  },
  placeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  placeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeAddress: {
    color: '#666666',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
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
  emptyStateTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
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