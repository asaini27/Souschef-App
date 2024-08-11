import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';

const CravingScreen = ({ navigation }) => {
  const [response, setResponse] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const scaleValue = useRef(new Animated.Value(1)).current;

  const startZooming = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopZooming = () => {
    scaleValue.stopAnimation();
    scaleValue.setValue(1); // Reset to initial value
  };

  const startAIModel = async () => {
    try {
      const response = await fetch('http://192.168.4.95:3000/start-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setResponse(data.message);
    } catch (error) {
      console.error('Error starting AI model:', error);
    }
  };

  const stopAIModel = async () => {
    try {
      const response = await fetch('http://192.168.4.95:3000/stop-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setResponse(data.message);
    } catch (error) {
      console.error('Error stopping AI model:', error);
    }
  };

  useEffect(() => {
    if (isRunning) {
      startAIModel();
      startZooming();
    } else {
      stopAIModel();
      stopZooming();
    }
  }, [isRunning]);

  const handlePress = () => {
    setIsRunning((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>Your SousChef is waiting for instructions</Text>
      <TouchableOpacity onPress={handlePress}>
        <Animated.Image 
          source={require('../assets/chef.png')} 
          style={[styles.chefImage, { transform: [{ scale: scaleValue }] }]} 
        />
      </TouchableOpacity>
      <Text>{response}</Text>
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
  instructionText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  chefImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
});

export default CravingScreen;



