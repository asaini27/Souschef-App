import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, TouchableOpacity, Platform, View, Text, TextInput, Alert, StyleSheet, Image } from 'react-native';
import { registerUser } from '../ApiService'; // Update the path if necessary

function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [foodAllergies, setFoodAllergies] = useState('');

  const handleRegistration = async () => {
    try {
      const response = await registerUser({ username, email, password, food_allergies: foodAllergies });
      if (response.message) {
        navigation.navigate('MainTab');
      } else {
        Alert.alert('Error', 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Registration failed');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.headerText}>Signup</Text>
        <Image source={require('../assets/logo.png')} style={styles.image} />
        <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Enter Username" />
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Enter Email id/ Phone No." keyboardType="email-address" />
        <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
        <TextInput style={styles.input} value={foodAllergies} onChangeText={setFoodAllergies} placeholder="Confirm Password" />
        <TouchableOpacity style={styles.registerButton} onPress={handleRegistration}>
          <Text style={styles.registerButtonText}>Signup</Text>
        </TouchableOpacity>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have An Account? 
            <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}> Login</Text>
          </Text>
          <Text style={styles.loginText}>Already have An Account? 
            <Text style={styles.loginLink} onPress={() => navigation.navigate('MainTab')}> Login</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 150,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  registerButton: {
    backgroundColor: '#ff5722',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 10,
    marginTop: 20,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#000',
  },
  loginLink: {
    color: '#ff5722',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
