import { View, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter, Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { user } = useAuth();
  const [redirect, setRedirect] = useState<string | null>(null);

  useEffect(() => {
    // Delay the redirect until after component mount
    if (user?.isAuthenticated) {
      setRedirect('/(tabs)');
    } else {
      setRedirect('/(auth)/login');
    }
  }, [user]);

  // Return null initially while determining redirect
  if (!redirect) {
    return null;
  }

  // Only redirect once the component is mounted and redirect is set
  return <Redirect href={redirect} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});