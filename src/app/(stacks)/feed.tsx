import { StyleSheet } from 'react-native';

import { Text, View } from "@/src/components/Themed"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"



export default function FeedScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View>
          <Text>
            FEED
          </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

});
