import React, { useState } from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';

function HomeScreen({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);

  const navigateToScreen = (screen) => {
    setMenuVisible(false);
    navigation.navigate(screen);
  };

  const closeDropdown = () => {
    setMenuVisible(false);
  };

  return (
    <View style={styles.container}>

      <View style={styles.mainContent}>
        <Text style={styles.greeting}>Hi,</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => navigateToScreen('YourTaste')}>
            <Text style={styles.buttonText}>Your Taste</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
  
          <TouchableOpacity style={styles.button} onPress={() => navigateToScreen('Favorites')}>
            <Text style={styles.buttonText}>Your Favorites</Text>
          </TouchableOpacity>
        </View>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchBar: {
    backgroundColor: '#eee',
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
  },
  modalView: {
    margin: 50,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalItem: {
    marginBottom: 15,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'red',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  navButton: {
    alignItems: 'center',
  },
  icon: {
    width: 34,
    height: 34,
  },
});

export default HomeScreen;
