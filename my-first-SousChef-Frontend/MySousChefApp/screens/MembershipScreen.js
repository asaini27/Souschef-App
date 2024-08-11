import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function MembershipScreen() {
  return (
    <View style={styles.container}>
      <Text>Membership Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MembershipScreen;