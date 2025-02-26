import { Stack, router } from 'expo-router';
import { Pressable } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#121212',
        },
        headerTintColor: '#ffffff',
        headerLeft: () => (
          <Pressable onPress={() => router.back()}>
            <ArrowLeft size={24} color="#ffffff" />
          </Pressable>
        ),
      }}>
      <Stack.Screen
        name="sign-in"
        options={{
          title: 'Sign In',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          title: 'Sign Up',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: 'Reset Password',
          headerShown: false,
        }}
      />
    </Stack>
  );
}