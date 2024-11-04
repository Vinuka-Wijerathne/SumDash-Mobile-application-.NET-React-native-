import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import TopBar from '../topbar/topbar';
import Footer from '../footer/footer';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { useTheme } from '../../../ThemeContext';

const DashboardPage = ({ navigation }) => {
  const { isDarkMode } = useTheme();

  const levels = [
    { name: 'Beginner', timeLimit: 60 },
    { name: 'Intermediate', timeLimit: 45 },
    { name: 'Hard', timeLimit: 30 },
  ];

  const handleLevelSelect = (level) => {
    // Navigate to GamePage with selected time limit as a parameter
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
          Welcome to SumDash
        </Text>

        <LottieView
          source={require('../../../assets/welcome.json')} // Path to your Lottie file
          autoPlay
          loop
          style={styles.lottie}
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
    marginTop: 30,
    textAlign: 'center',
  },
  darkWelcomeText: {
    color: '#ffff00',
  },
  lottie: {
    width: 200,
    height: 200,
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
