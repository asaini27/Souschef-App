// screens/WelcomeScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>SousChef AI!</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Register" color="#ffffff" onPress={() => navigation.navigate('Register')} />
        <Button title="If you are already a user, then Login here" color="#ffffff" onPress={() => navigation.navigate('Login')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF0000', // Light red color
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginBottom: 50, // Adjust this value as needed to move buttons towards the bottom
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 40,
    color: '#ffffff',
    marginBottom: 20,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
