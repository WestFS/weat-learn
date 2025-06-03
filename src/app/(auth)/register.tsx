import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { Text, View } from '@/src/components/Themed';
import { useState } from 'react';



export default function register() {
  return(
    <SafeAreaView style={{flex: 1, backgroundColor: '#e8ecf4'}}>
      <View style={styles.container}>
        <Text style={styles.title}>
            Create an account
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#929292'
  },
})
