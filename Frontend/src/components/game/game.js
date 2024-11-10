import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Animated, Image } from 'react-native';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [animationValue] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchQuestion();
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      showFeedback(`Game Over! Your score is ${score}`, true);
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
      showFeedback('Correct Answer!', false); // Show feedback for correct answer
      fetchQuestion(); // Load a new question on correct answer
    } else {
      showFeedback('Incorrect Answer! Try again.', true); // Show feedback for incorrect answer
    }
    setUserAnswer(''); // Clear input field after submission
  };

  const showFeedback = (message, isError) => {
    setFeedbackMessage(message);
    setModalVisible(true);
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        setModalVisible(false);
        animationValue.setValue(0); // Reset for next use
      }, 1000);
    });
  };

  const feedbackStyle = {
    opacity: animationValue,
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('../../../assets/back.png')} style={styles.backButtonImage} />
        <Text style={[styles.backButtonText, isDarkMode && styles.darkButtonText]}>Back</Text>
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
        placeholderTextColor={isDarkMode ? '#bbbbbb' : '#888888'}
      />
      <TouchableOpacity style={[styles.button, isDarkMode && styles.darkButton]} onPress={handleAnswerSubmit}>
        <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>Submit</Text>
      </TouchableOpacity>

      {/* Feedback Modal */}
      <Modal transparent={true} animationType="fade" visible={modalVisible}>
        <View style={[styles.modalContainer, isDarkMode && styles.darkContainer]}>
          <Animated.View style={[styles.modalContent, feedbackStyle]}>
            <Text style={[styles.modalText, isDarkMode && styles.darkText]}>{feedbackMessage}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={[styles.modalCloseButton, isDarkMode && styles.darkButtonText]}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
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
    marginRight: 10,
  },
  backButtonText: {
    color: '#6200ee',
    fontSize: 18,
    fontWeight: '600',
  },
  darkButtonText: {
    color: '#ffff00',
  },
  timer: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 15,
    color: '#ff4444',
    fontWeight: '700',
  },
  score: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 25,
    color: '#4CAF50',
    fontWeight: '700',
  },
  questionImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 25,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  input: {
    borderColor: '#6200ee',
    borderWidth: 1,
    padding: 15,
    marginBottom: 25,
    borderRadius: 25,
    fontSize: 18,
    color: '#333',
  },
  darkInput: {
    borderColor: '#ffff00',
    color: '#ffff00',
  },
  button: {
    backgroundColor: '#6200ee',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    
  },
  darkButton: {
    backgroundColor: '#444444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 25,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop: 15,
    color: '#6200ee',
    fontSize: 18,
    fontWeight: '500',
  },
  darkText: {
    color: '#ffff00',
  },
});

export default GamePage;
