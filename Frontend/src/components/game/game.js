import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';
import { useTheme } from '../../../ThemeContext'; // Import your theme context

const GamePage = ({ route, navigation }) => {
  const { timeLimit } = route.params; // Retrieve time limit from navigation params
  const { isDarkMode } = useTheme(); // Get the theme state
  const [questionImage, setQuestionImage] = useState('');
  const [solution, setSolution] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    fetchQuestion();
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      Alert.alert('Game Over', `Your score is ${score}`);
      navigation.navigate('Dashboard'); // Navigate to the dashboard on game over
    }
  }, [timeLeft]);

  const fetchQuestion = async () => {
    try {
      const response = await axios.get('https://marcconrad.com/uob/banana/api.php');
      setQuestionImage(response.data.question); // Set image URL for the question
      setSolution(response.data.solution); // Set solution for validation
      setUserAnswer(''); // Clear user input
    } catch (error) {
      console.error(error);
    }
  };

  const handleAnswerSubmit = () => {
    if (parseInt(userAnswer) === solution) {
      setScore(score + 1);
      setTimeLeft(timeLimit); // Reset timer on correct answer
      fetchQuestion(); // Load a new question on correct answer
    } else {
      Alert.alert('Incorrect Answer', 'Try again!');
    }
    setUserAnswer(''); // Clear input field after submission
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('../../../assets/back.png')} style={styles.backButtonImage} />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      
      <Text style={[styles.timer, isDarkMode && styles.darkText]}>Time Left: {timeLeft}s</Text>
      <Text style={[styles.score, isDarkMode && styles.darkText]}>Score: {score}</Text>
      
      {/* Display the question image */}
      <Image source={{ uri: questionImage }} style={styles.questionImage} />

      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        placeholder="Enter your answer"
        keyboardType="numeric"
        value={userAnswer}
        onChangeText={setUserAnswer}
      />
      <TouchableOpacity style={[styles.button, isDarkMode && styles.darkButton]} onPress={handleAnswerSubmit}>
        <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#222222',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 150,
  },
  backButtonImage: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  backButtonText: {
    color: '#6200ee',
    fontSize: 16,
    fontWeight: '600',
  },
  timer: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 10,
    color: '#ff4444', // Bright red for visibility
    fontWeight: '700',
  },
  darkText: {
    color: '#ffff00',
  },
  score: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
    color: '#4CAF50', // Green for success
    fontWeight: '700',
  },
  questionImage: {
    width: '100%',
    height: 220,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    borderColor: '#6200ee',
    borderWidth: 1,
    padding: 10,
    marginBottom: 16,
    borderRadius: 30, // More rounded corners
    fontSize: 18,
    color: '#333',
  },
  darkInput: {
    borderColor: '#ffff00',
    color: '#ffff00',
  },
  button: {
    backgroundColor: '#6200ee',
    paddingVertical: 10, // Smaller button height
    borderRadius: 30, // More rounded corners
    alignItems: 'center',
    marginTop: 10,
  },
  darkButton: {
    backgroundColor: '#444444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16, // Slightly smaller text size
    fontWeight: '600',
  },
  darkButtonText: {
    color: '#ffff00',
  },
});

export default GamePage;
