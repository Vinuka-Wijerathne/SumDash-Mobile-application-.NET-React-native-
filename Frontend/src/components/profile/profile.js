import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useTheme } from '../../../ThemeContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '../footer/footer';
import { AntDesign } from '@expo/vector-icons';

import { storage } from '../../../firebaseConfig';

const ProfilePage = () => {
  const { isDarkMode, fontStyle } = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNext, setShowNext] = useState(false);

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
        const response = await axios.get(`http://192.168.164.70:5000/api/user/${userId}`, {
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
    if (!permissionResult.granted) {
      setError("Permission to access gallery is required!");
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
        
        if (downloadURL) {
          setUserData((prev) => ({ ...prev, profilePictureUrl: downloadURL }));
        } else {
          setError("Image upload failed. Please try again.");
        }
      } catch (uploadError) {
        setError("Image upload failed. Please try again.");
      }
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Are you sure?",
      "This action will permanently delete your account. You cannot undo this.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const userId = await AsyncStorage.getItem('userId');
              if (!token || !userId) {
                setError('No authentication token or user ID found');
                return;
              }
              await axios.delete(`http://192.168.164.70:5000/api/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('userId');
              setError('Account Deleted Successfully');
            } catch (error) {
              setError("Failed to delete the account. Please try again.");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        <ActivityIndicator size="large" color={isDarkMode ? "#fff" : "#000"} />
      </View>
    );
  }

  const profileImageUrl = userData.profilePictureUrl || require('../../../assets/Profile.png');

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {error && <Text style={[styles.errorText, { fontFamily: fontStyle }]}>{error}</Text>}
      <Image source={profileImageUrl} style={styles.profileImage} />
      <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
        <Text style={styles.uploadButtonText}>Upload Profile Picture</Text>
      </TouchableOpacity>
      
      {/* Displaying the user's email and username */}
      <Text style={[styles.username, isDarkMode && styles.darkUsername, { fontFamily: fontStyle }]}>
        {userData.username}
      </Text>
      <Text style={[styles.email, isDarkMode && styles.darkEmail, { fontFamily: fontStyle }]}>
        {userData.email}
      </Text>
      <Text style={[styles.joinedDate, isDarkMode && styles.darkJoinedDate, { fontFamily: fontStyle }]}>
        Joined in {new Date(userData.joinDate).getFullYear()}
      </Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <AntDesign name="star" size={24} color="#FFD700" />
          <Text style={[styles.statValue, { fontFamily: fontStyle }]}>{userData.yellowPoints || 0}</Text>
          <Text style={[styles.statTitle, { fontFamily: fontStyle }]}>Yellow Points</Text>
        </View>
        <View style={styles.statBox}>
          <AntDesign name="checkcircle" size={24} color="#4CAF50" />
          <Text style={[styles.statValue, { fontFamily: fontStyle }]}>{userData.successfulAttempts || 0}</Text>
          <Text style={[styles.statTitle, { fontFamily: fontStyle }]}>Successful Attempts</Text>
        </View>
        <View style={styles.statBox}>
          <AntDesign name="staro" size={24} color="#C0C0C0" />
          <Text style={[styles.statValue, { fontFamily: fontStyle }]}>{userData.silverPoints || 0}</Text>
          <Text style={[styles.statTitle, { fontFamily: fontStyle }]}>Silver Points</Text>
        </View>
        <View style={styles.statBox}>
          <AntDesign name="star" size={24} color="#FFD700" />
          <Text style={[styles.statValue, { fontFamily: fontStyle }]}>{userData.goldPoints || 0}</Text>
          <Text style={[styles.statTitle, { fontFamily: fontStyle }]}>Gold Points</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </TouchableOpacity>
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
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#FFD700',
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#FFD700',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  uploadButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  darkUsername: {
    color: '#ffff00',
  },
  darkEmail: {
    color: '#bbbb00',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 8,
    width: '23%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#555',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ProfilePage;
