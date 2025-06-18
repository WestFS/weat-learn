import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/src/contexts/AuthContext';

export default function ArticleEditor() {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Please log in to access the article editor.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Article Editor</Text>
      <Text style={styles.text}>Welcome, {user?.name}!</Text>
      <Text style={styles.text}>Article editor functionality coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
});
