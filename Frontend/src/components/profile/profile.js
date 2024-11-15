import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createClient } from '@supabase/supabase-js';
import { useTheme } from '../../../ThemeContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '../footer/footer';
import { AntDesign } from '@expo/vector-icons';

// Initialize Supabase client
const supabaseUrl = 'https://vjkxqqdssbjbugxjxnvk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqa3hxcWRzc2JqYnVneGp4bnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2NTM5MjAsImV4cCI6MjA0NzIyOTkyMH0.VE_G_HXzvaZJsZ4CE-9sDQx-pDqi_PjEWLNjtBYVDz4';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

  const formatDate = (dateString) => {
    if (!dateString) return "No date available"; 
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid date";
    
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const suffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    
    return `${day}${suffix(day)} of ${month} ${year}`;
  };
  
  const handleImageUpload = async () => {
    try {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        setError("Permission to access gallery is required!");
        return;
      }
  
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      const uri = pickerResult.assets ? pickerResult.assets[0].uri : undefined;
      console.log("Image URI:", uri);
  
      if (!uri) return;
  
      const userId2 = await AsyncStorage.getItem('userId');
      console.log(userId2);
  
      // Upload to Supabase storage with the bucket 'SumDash'
      const fileName = `${userId2}-${Date.now()}.jpg`;
      const filePath = `profile_pictures/${fileName}`;
      const { data, error } = await supabase.storage.from('SumDash').upload(filePath, {
        uri,
        type: 'image/jpeg',
        name: fileName,
      });
  
      if (error) {
        console.error("Supabase upload error:", error);
        setError("Image upload failed. Please try again.");
        return;
      }
  
      console.log("Image uploaded to Supabase. Path:", filePath);
  
      // Generate a signed URL for the uploaded image (private URL)
      const { data: signedData, error: signedUrlError } = await supabase.storage
        .from('SumDash')
        .createSignedUrl(filePath, 60); // The 60 here is the expiration time for the URL in seconds
  
      if (signedUrlError) {
        console.error("Error generating signed URL:", signedUrlError);
        setError("Failed to retrieve signed image URL.");
        return;
      }
  
      const signedURL = signedData.signedUrl;
      console.log("Signed URL of image:", signedURL);
  
      // Update the user's profile picture URL in the backend
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem('userId');
      if (!token || !userId) {
        setError("No authentication token or user ID found");
        return;
      }
  
      await axios.put(
        `http://192.168.164.70:5000/api/user/${userId}/updateProfile`,
        { profilePictureUrl: signedURL },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setUserData((prev) => ({ ...prev, profilePictureUrl: signedURL }));
      console.log("Profile picture URL updated in backend:", signedURL);
  
    } catch (error) {
      setError("Image upload failed. Please try again.");
      console.error("Image upload error:", error);
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

  const profileImageUrl = userData?.profilePictureUrl ? { uri: userData.profilePictureUrl } : require('../../../assets/Profile.png');


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
  Joined on {formatDate(userData.dateJoined)}
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
