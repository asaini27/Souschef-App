const API_URL = 'http://192.168.4.95:3000'; // 100.88.228.24 192.168.1.74 Replace with your actual local IP address or deployed server URL

export const registerUser = async (userData) => {
  try {
    console.log(`Making request to: ${API_URL}/register`);
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    console.log('Response:', data);
    return data;
  } catch (error) {
    console.error('Error during user registration:', error);
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    console.log(`Making request to: ${API_URL}/login`);
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    console.log('Response:', data);
    return data;
  } catch (error) {
    console.error('Error during user login:', error);
    throw error;
  }
};

export const savePreferences = async (preferencesData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log(`Making request to: ${API_URL}/save-preferences`);
    const response = await fetch(`${API_URL}/save-preferences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(preferencesData),
    });
    const data = await response.json();
    console.log('Response:', data);
    return data;
  } catch (error) {
    console.error('Error saving preferences:', error);
    throw error;
  }
};
