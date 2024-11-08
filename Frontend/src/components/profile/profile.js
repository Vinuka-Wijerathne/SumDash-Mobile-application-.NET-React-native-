import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import Footer from '../footer/footer';
import { useTheme } from '../../../ThemeContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For token storage

const ProfilePage = () => {
  const { isDarkMode } = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Retrieve the token from AsyncStorage or your global state
        const token = await AsyncStorage.getItem('token'); // Assumes token is stored in AsyncStorage
  
        console.log("Token retrieved from AsyncStorage:", token);  // Log token for debugging
  
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }
  
        // Retrieve the userId from AsyncStorage or global state
        const userId = await AsyncStorage.getItem('userId'); // Assuming userId is stored in AsyncStorage
  
        console.log("User ID retrieved from AsyncStorage:", userId);  // Log userId for debugging
  
        if (!userId) {
          setError('No user ID found');
          setLoading(false);
          return;
        }
  
        // Make the API call to fetch user data
        const response = await axios.get(`http://192.168.145.70:5000/api/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Send token for authorization
          }
        });
  
        console.log("User data fetched successfully:", response.data);  // Log user data for debugging
  
        setUserData(response.data); // Set user data into state
      } catch (err) {
        console.log("Error fetching user data:", err);  // Log any error for debugging
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);
  
  if (loading) {
    return (
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        <ActivityIndicator size="large" color={isDarkMode ? "#fff" : "#000"} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Profile Image */}
      <Image
        source={{ uri: userData.profilePictureUrl || '../../../assets/Profile.png' }} // Default image if profile picture URL is missing
        style={styles.profileImage}
      />

      {/* Username and Joined Date */}
      <Text style={[styles.username, isDarkMode && styles.darkUsername]}>{userData.username}</Text>
      <Text style={[styles.joinedDate, isDarkMode && styles.darkJoinedDate]}>
        Joined in {new Date(userData.joinDate).getFullYear()}
      </Text>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Yellow Points</Text>
          <Text style={styles.statValue}>{userData.yellowPoints || 0}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Successful Attempts</Text>
          <Text style={styles.statValue}>{userData.successfulAttempts || 0}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Silver Points</Text>
          <Text style={styles.statValue}>{userData.silverPoints || 0}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Gold Points</Text>
          <Text style={styles.statValue}>{userData.goldPoints || 0}</Text>
        </View>
      </View>

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    paddingVertical: 20,
  },
  darkContainer: {
    backgroundColor: '#222222',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  darkUsername: {
    color: '#ffff00',
  },
  joinedDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  darkJoinedDate: {
    color: '#bbbb00',
  },
  statsContainer: {
    width: '90%',
    alignItems: 'center',
  },
  statBox: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 16,
    color: '#333',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfilePage;
