import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/auth';
import { supabase } from '../../lib/supabase';
import { Camera, Mail, LogOut, ChevronRight, Settings, Heart, MapPin, Calendar, ArrowRight } from 'lucide-react-native';
import { Link } from 'expo-router';

export default function ProfileScreen() {
  const { session, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');

  const handleUpdateProfile = async () => {
    if (!session?.user.id) return;

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('users')
        .upsert({ 
          id: session.user.id,
          username: username || null,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      setError('Failed to sign out');
    }
  };

  if (!session) {
    return (
      <View style={styles.container}>
        <View style={styles.unauthenticatedContent}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Sign in to access your profile</Text>
          
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ 
                uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop'
              }}
              style={styles.avatar}
            />
            <Pressable style={styles.avatarButton}>
              <Camera size={20} color="#ffffff" />
            </Pressable>
          </View>
          {isEditing ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.usernameInput}
                placeholder="Enter username"
                placeholderTextColor="#666666"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
              <View style={styles.editActions}>
                <Pressable 
                  style={[styles.editButton, styles.cancelButton]}
                  onPress={() => setIsEditing(false)}>
                  <Text style={styles.editButtonText}>Cancel</Text>
                </Pressable>
                <Pressable 
                  style={[styles.editButton, styles.saveButton]}
                  onPress={handleUpdateProfile}
                  disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <Text style={styles.editButtonText}>Save</Text>
                  )}
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable onPress={() => setIsEditing(true)}>
              <Text style={styles.username}>{username || 'Add username'}</Text>
              <Text style={styles.email}>{session.user.email}</Text>
            </Pressable>
          )}
        </View>

        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Places Visited</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Events Joined</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity</Text>
        <Pressable style={styles.menuItem}>
          <Heart size={24} color="#666666" />
          <Text style={styles.menuText}>Saved Places</Text>
          <ChevronRight size={20} color="#666666" />
        </Pressable>
        <Pressable style={styles.menuItem}>
          <MapPin size={24} color="#666666" />
          <Text style={styles.menuText}>My Reviews</Text>
          <ChevronRight size={20} color="#666666" />
        </Pressable>
        <Pressable style={styles.menuItem}>
          <Calendar size={24} color="#666666" />
          <Text style={styles.menuText}>Upcoming Events</Text>
          <ChevronRight size={20} color="#666666" />
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <Pressable style={styles.menuItem}>
          <Settings size={24} color="#666666" />
          <Text style={styles.menuText}>Preferences</Text>
          <ChevronRight size={20} color="#666666" />
        </Pressable>
        <Pressable style={styles.menuItem} onPress={handleSignOut}>
          <LogOut size={24} color="#ff4444" />
          <Text style={[styles.menuText, styles.signOutText]}>Sign Out</Text>
          <ChevronRight size={20} color="#ff4444" />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  unauthenticatedContent: {
    flex: 1,
    padding: 16,
    paddingTop: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
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
  header: {
    padding: 16,
    paddingTop: 48,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  email: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 4,
  },
  editContainer: {
    width: '100%',
    alignItems: 'center',
  },
  usernameInput: {
    backgroundColor: '#2a2a2a',
    color: '#ffffff',
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    width: '80%',
    textAlign: 'center',
  },
  editActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#2a2a2a',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#2a2a2a',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#666666',
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  menuText: {
    color: '#ffffff',
    fontSize: 16,
    flex: 1,
    marginLeft: 12,
  },
  signOutText: {
    color: '#ff4444',
  },
  error: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});