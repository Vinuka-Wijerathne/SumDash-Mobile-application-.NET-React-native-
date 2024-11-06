import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopBar from '../topbar/topbar';
import Footer from '../footer/footer';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { useTheme } from '../../../ThemeContext';
import axios from 'axios';  // Assuming you're using axios for API calls

const DashboardPage = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    // Fetch the token from AsyncStorage
    const fetchTokenAndUsername = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('Token');
        if (savedToken) {
          setToken(savedToken);
          // After getting the token, fetch the username associated with it
          const response = await axios.get('http://192.168.8.105:5000/api/User', {
            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
          });
          if (response.data.Username) {
            setUsername(response.data.Username);  // Assuming the username is returned in the response
          }
        }
      } catch (error) {
        console.error('Failed to load token or username:', error);
      }
    };

    fetchTokenAndUsername();
  }, []);

  const levels = [
    { name: 'Beginner', timeLimit: 60 },
    { name: 'Intermediate', timeLimit: 45 },
    { name: 'Hard', timeLimit: 30 },
  ];

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
        <Text style={[styles.welcomeText, isDarkMode && styles.darkWelcomeText]}>
          Hi {username ? username : 'Loading...'}, Welcome to SumDash!
        </Text>

        <LottieView
          source={require('../../../assets/welcome.json')}
          autoPlay
          loop
          style={styles.lottieSmall}  // Updated style for smaller Lottie animation
        />

        <Text style={[styles.title, isDarkMode && styles.darkTitle]}>Choose Your Level</Text>

        {levels.map((level, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.button, isDarkMode && styles.darkButton]}
            onPress={() => handleLevelSelect(level)}
          >
            <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>{level.name}</Text>
            <Text style={[styles.timeText, isDarkMode && styles.darkTimeText]}>{level.timeLimit} seconds</Text>
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
    width: 150, // Reduced size
    height: 150, // Reduced size
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
