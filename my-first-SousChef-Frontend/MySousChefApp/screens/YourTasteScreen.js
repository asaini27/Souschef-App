import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, TouchableOpacity, Platform, View, Text, TextInput, Alert, StyleSheet, Image } from 'react-native';
import { savePreferences } from '../ApiService'; // Update the path if necessary

function YourTasteScreen({ navigation }) {
  const [preferences, setPreferences] = useState('');
  const [allergies, setAllergies] = useState('');

  const handleSavePreferences = async () => {
    try {
      const response = await savePreferences({ preferences, allergies });
      if (response.message === 'Preferences saved successfully') {
        Alert.alert('Success', 'Preferences saved successfully!');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to save preferences');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while saving preferences');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Image source={require('../assets/chef-image.png')} style={styles.image} />
        <TextInput
          style={styles.input}
          value={preferences}
          onChangeText={setPreferences}
          placeholder="Food Preferences"
        />
        <TextInput
          style={styles.input}
          value={allergies}
          onChangeText={setAllergies}
          placeholder="Food Allergies"
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSavePreferences}>
          <Text style={styles.saveButtonText}>Save Preferences</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 400,
    height: 350,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default YourTasteScreen;
