import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopBar from '../topbar/topbar';
import Footer from '../footer/footer';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { useTheme } from '../../../ThemeContext';
import axios from 'axios';

const DashboardPage = ({ navigation }) => {
  const { isDarkMode, fontStyle } = useTheme(); // Fetch fontStyle from theme context
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  const levels = [
    { name: 'Beginner', timeLimit: 60 },
    { name: 'Intermediate', timeLimit: 45 },
    { name: 'Hard', timeLimit: 30 },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.log('Token not found');
          setLoading(false);
          return;
        }

        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          console.log('User ID not found');
          setLoading(false);
          return;
        }

        // Fetch user data with token and userId
        const response = await axios.get(`http://192.168.164.70:5000/api/User/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Adjusted to match response format
        setUsername(response.data.username);  // Or response.data.user.username if the `user` is nested one level down
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLevelSelect = (level) => {
    navigation.navigate('Game', { timeLimit: level.timeLimit });
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <TopBar title="SumDash" />
      <LinearGradient
        colors={isDarkMode ? ['#333333', '#444444'] : ['#ffffff', '#e0e0ff']}
        style={styles.contentContainer}
      >
        <Text
          style={[
            styles.welcomeText,
            { fontFamily: fontStyle }, // Apply the selected font style here
            isDarkMode && styles.darkWelcomeText,
          ]}
        >
          {loading ? 'Loading user data...' : `Hi ${username}, Welcome to SumDash!`}
        </Text>

        <LottieView
          source={require('../../../assets/welcome.json')}
          autoPlay
          loop
          style={styles.lottieSmall}
        />

        <Text
          style={[
            styles.title,
            { fontFamily: fontStyle }, // Apply the selected font style here
            isDarkMode && styles.darkTitle,
          ]}
        >
          Choose Your Level
        </Text>

        {levels.map((level, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.button, isDarkMode && styles.darkButton]}
            onPress={() => handleLevelSelect(level)}
          >
            <Text
              style={[
                styles.buttonText,
                { fontFamily: fontStyle }, // Apply the selected font style here
                isDarkMode && styles.darkButtonText,
              ]}
            >
              {level.name}
            </Text>
            <Text
              style={[
                styles.timeText,
                { fontFamily: fontStyle }, // Apply the selected font style here
                isDarkMode && styles.darkTimeText,
              ]}
            >
              {level.timeLimit} seconds
            </Text>
          </TouchableOpacity>
        ))}
      </LinearGradient>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#222222',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginTop: 20,
    textAlign: 'center',
  },
  darkWelcomeText: {
    color: '#ffff00',
  },
  lottieSmall: {
    width: 150,
    height: 150,
    marginVertical: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  darkTitle: {
    color: '#ffff00',
  },
  button: {
    backgroundColor: '#6200ea',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: '80%',
  },
  darkButton: {
    backgroundColor: '#444444',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  darkButtonText: {
    color: '#ffff00',
  },
  timeText: {
    color: '#f0f0f0',
    fontSize: 14,
    marginTop: 5,
  },
  darkTimeText: {
    color: '#bbbb00',
  },
});

export default DashboardPage;
