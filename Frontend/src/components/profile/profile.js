import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useTheme } from '../../../ThemeContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '../footer/footer';

// Import Firebase config from the root directory (already initialized)
import { storage } from '../../../firebaseConfig';

const ProfilePage = () => {
  const { isDarkMode } = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');

        if (!token || !userId) {
          setError('No authentication token or user ID found');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://192.168.58.70:5000/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(response.data);
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access gallery is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.cancelled) {
      const uri = pickerResult.uri;
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `profile_pictures/${userData.userId}`);
      try {
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        console.log('Image uploaded successfully:', downloadURL);
        
        setUserData((prev) => ({ ...prev, profilePictureUrl: downloadURL }));
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        Alert.alert("Image upload failed. Please try again.");
      }
    }
  };

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

  const profileImageUrl = userData.profilePictureUrl || require('../../../assets/Profile.png');

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Image source={profileImageUrl} style={styles.profileImage} />
      <Button title="Upload Profile Picture" onPress={handleImageUpload} />
      <Text style={[styles.username, isDarkMode && styles.darkUsername]}>{userData.username}</Text>
      <Text style={[styles.joinedDate, isDarkMode && styles.darkJoinedDate]}>
        Joined in {new Date(userData.joinDate).getFullYear()}
      </Text>

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
