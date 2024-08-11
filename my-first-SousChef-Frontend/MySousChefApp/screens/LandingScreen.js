// screens/LandingScreen.js

import React from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';

const LandingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SousChef</Text>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      
      <Text style={styles.tagline}>Your AI-powered kitchen assistant</Text>
      <Image source={require('../assets/cool-image.png')} style={styles.image} />
      <Button color={'#ff5722'}
        title="Get Started"
        onPress={() => navigation.navigate('Register')}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: '#ff5722',
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#f08a5d',
    padding: 10,
    borderRadius: 5,
  },
});

export default LandingScreen;
