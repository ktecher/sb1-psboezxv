import { Pressable, StyleSheet } from 'react-native';
import { Bookmark } from 'lucide-react-native';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/auth';

type SaveButtonProps = {
  placeId: string;
  initialSaved?: boolean;
  size?: number;
  style?: any;
};

export default function SaveButton({ placeId, initialSaved = false, size = 24, style }: SaveButtonProps) {
  const { session } = useAuth();
  const [isSaved, setIsSaved] = useState(initialSaved);

  const toggleSave = async () => {
    if (!session?.user.id) return;

    try {
      if (isSaved) {
        await supabase
          .from('saved_places')
          .delete()
          .eq('place_id', placeId)
          .eq('user_id', session.user.id);
      } else {
        await supabase
          .from('saved_places')
          .insert({
            place_id: placeId,
            user_id: session.user.id,
          });
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  if (!session?.user.id) return null;

  return (
    <Pressable
      style={[styles.button, isSaved && styles.buttonActive, style]}
      onPress={toggleSave}>
      <Bookmark
        size={size}
        color={isSaved ? '#ffffff' : '#666666'}
        fill={isSaved ? '#ffffff' : 'transparent'}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#007AFF',
  },
});