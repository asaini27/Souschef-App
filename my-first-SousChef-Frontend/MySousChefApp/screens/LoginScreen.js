import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, TouchableOpacity, Platform, View, Text, TextInput, Alert, StyleSheet, Image } from 'react-native';
import { loginUser } from '../ApiService'; // Update the path if necessary

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Validation Error', 'Username and password are required.');
      return;
    }

    try {
      const response = await loginUser({ username, password });
      if (response.token) {
        navigation.navigate('MainTab');
        // Here you would typically navigate to another screen or set the user state
      } else {
        Alert.alert('Login Failed', response.message || 'Please check your credentials.');
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.headerText}>Login</Text>
        <Image source={require('../assets/chef-image.png')} style={styles.image} />
        <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Username" />
        <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? 
            <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}> Signup</Text>
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
  loginButton: {
    backgroundColor: '#ff5722',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 10,
    marginTop: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#000',
  },
  registerLink: {
    color: '#ff5722',
    fontWeight: 'bold',
  },
  orContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  orText: {
    fontSize: 16,
    color: '#888',
  },
  socialButton: {
    width: '100%',
    marginVertical: 10,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  socialButtonText: {
    color: '#000',
    fontSize: 16,
  },
});

export default LoginScreen;
