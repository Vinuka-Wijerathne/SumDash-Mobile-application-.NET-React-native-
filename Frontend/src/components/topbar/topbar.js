import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const TopBar = ({ logo }) => {
  const navigation = useNavigation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const { isDarkMode, toggleTheme, fontStyle } = useTheme();
  const slideAnim = new Animated.Value(-250);

  // Fetch user data and profile image
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.log('Token not found');
          return;
        }

        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          console.log('User ID not found');
          return;
        }

        // Fetch user data with token and userId
        const response = await axios.get(`http://192.168.164.70:5000/api/User/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Set profile image URL if available in the response
        setProfileImage(response.data.profilePictureUrl || ''); // Fallback to empty string if no image URL
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    Animated.timing(slideAnim, {
      toValue: sidebarOpen ? -250 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, { fontFamily: fontStyle }, isDarkMode ? styles.darkTitle : styles.lightTitle]}>
        SumDash
      </Text>

      <View style={styles.themeToggleContainer}>
        <Text style={[styles.themeToggleLabel, { fontFamily: fontStyle }, isDarkMode ? styles.darkThemeLabel : styles.lightThemeLabel]}>
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          thumbColor={isDarkMode ? "#ffffff" : "#000000"}
          trackColor={{ false: "#ddd", true: "#FFD700" }}
          style={styles.themeToggleSwitch}
        />
      </View>

      <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
        <Image
          source={profileImage ? { uri: profileImage } : require('../../../assets/Profile.png')}
          style={styles.profileImage}
        />
      </TouchableOpacity>

      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        <Text style={[styles.sidebarTitle, { fontFamily: fontStyle }]}>Menu</Text>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Leaderboard')}>
          <Icon name="trophy-outline" size={20} color="#FFD700" />
          <Text style={[styles.menuText, { fontFamily: fontStyle }]}>Leaderboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Dashboard')}>
          <Icon name="home-outline" size={20} color="#FFD700" />
          <Text style={[styles.menuText, { fontFamily: fontStyle }]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Profile')}>
          <Icon name="person-outline" size={20} color="#FFD700" />
          <Text style={[styles.menuText, { fontFamily: fontStyle }]}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
          <Icon name="settings-outline" size={20} color="#FFD700" />
          <Text style={[styles.menuText, { fontFamily: fontStyle }]}>Settings</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    height: 70,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginRight: 'auto',
  },
  lightTitle: {
    color: '#000000',
  },
  darkTitle: {
    color: '#FFD700',
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  themeToggleLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  lightThemeLabel: {
    color: '#000000',
  },
  darkThemeLabel: {
    color: '#FFD700',
  },
  themeToggleSwitch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  profileButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: '#333',
    padding: 20,
    zIndex: 20,
  },
  sidebarTitle: {
    fontSize: 22,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 18,
    color: '#FFD700',
    marginLeft: 10,
  },
});

export default TopBar;
