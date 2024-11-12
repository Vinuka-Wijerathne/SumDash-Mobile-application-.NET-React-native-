import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Animated, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../ThemeContext';

const GamePage = ({ route, navigation }) => {
  const { timeLimit } = route.params;
  const { isDarkMode, fontStyle } = useTheme();
  const [questionImage, setQuestionImage] = useState('');
  const [solution, setSolution] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [modalVisible, setModalVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [animationValue] = useState(new Animated.Value(0));
  const [isAnswerIncorrect, setIsAnswerIncorrect] = useState(false);  // Track if the answer is incorrect

  useEffect(() => {
    fetchQuestion();
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      showFeedback(`Game Over! Your score is ${score}`, true);
      navigation.navigate('Dashboard');
    }
  }, [timeLeft]);

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log('Token:', token);  // Log the token value
    return token;
  };

  const fetchQuestion = async () => {
    try {
      console.log('Fetching question...');
      const response = await axios.get('https://marcconrad.com/uob/banana/api.php');
      console.log('Question fetched:', response.data);  // Log the fetched question data
      setQuestionImage(response.data.question);
      setSolution(response.data.solution);
      setUserAnswer('');
      setIsAnswerIncorrect(false);  // Reset incorrect answer state when a new question is fetched
    } catch (error) {
      console.error('Error fetching question:', error);  // Log the error
    }
  };

  const getUserId = async () => {
    const userId = await AsyncStorage.getItem('userId');
    console.log('User ID:', userId);  // Log the user ID
    return userId;  // Ensure userId is saved in AsyncStorage
  };

  const updatePoints = async (pointType) => {
    try {
      const token = await getToken();
      const userId = await getUserId();
      if (!userId) {
        console.error("User ID is missing");
        return;
      }
  
      // You should fetch user details (username, email, passwordHash) based on userId
      // This is an example assuming you have a way to fetch the user data
      const user = await getUserDetails(userId);
  
      const pointsUpdate = {
        YellowPoints: 0,
        SilverPoints: 0,
        GoldPoints: 0,
        SuccessfulAttempts: 1,
      };
  
      // Set points based on the pointType
      if (pointType === "YellowPoints") {
        pointsUpdate.YellowPoints = 10; // Example value
      } else if (pointType === "SilverPoints") {
        pointsUpdate.SilverPoints = 5; // Example value
      } else if (pointType === "GoldPoints") {
        pointsUpdate.GoldPoints = 2; // Example value
      }
  
      // Prepare the payload
      const payload = {
        username: user.username,
        email: user.email,
        passwordHash: user.passwordHash,
        pointsUpdate,
      };
  
      console.log('Updating points with payload:', payload);
  
      const response = await axios.put(
        `http://192.168.58.70:5000/api/user/${userId}/updatePoints`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      console.log("Points updated successfully:", response.data);
    } catch (error) {
      console.error("Failed to update points:", error.response ? error.response.data : error.message);
    }
  };
  
  // Example function to fetch user details (username, email, passwordHash)
  const getUserDetails = async (userId) => {
    // Assuming you have an API to fetch the user details using userId
    try {
      const response = await axios.get(`http://192.168.58.70:5000/api/user/${userId}`);
      return response.data; // Returning user data
    } catch (error) {
      console.error("Failed to fetch user details:", error.response ? error.response.data : error.message);
      return {};
    }
  };
  

  const handleAnswerSubmit = () => {
    console.log('User answer submitted:', userAnswer);  // Log the user answer
    if (parseInt(userAnswer) === solution) {
      console.log('Correct answer!');  // Log correct answer
      setScore(score + 1);
      setTimeLeft(timeLimit);
      showFeedback('Correct Answer!', false);
      fetchQuestion();

      // Determine point type based on selected level
      const pointType =
        timeLimit === 60 ? "YellowPoints" :
        timeLimit === 45 ? "SilverPoints" : "GoldPoints";

      updatePoints(pointType);  // Pass the point type for scoring
    } else {
      console.log('Incorrect answer.');  // Log incorrect answer
      showFeedback(`Incorrect Answer! The correct answer is ${solution}`, true);
      setIsAnswerIncorrect(true);  // Mark the answer as incorrect
    }
    setUserAnswer('');
  };

  const showFeedback = (message, isError) => {
    console.log('Feedback message:', message);  // Log the feedback message
    setFeedbackMessage(message);
    setModalVisible(true);
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        setModalVisible(false);
        animationValue.setValue(0);
      }, 1000);
    });
  };

  const feedbackStyle = {
    opacity: animationValue,
  };

  const handleTryAgain = () => {
    fetchQuestion();  // Load a new question when user clicks "Try Again"
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('../../../assets/back.png')} style={styles.backButtonImage} />
        <Text style={[styles.backButtonText, isDarkMode && styles.darkButtonText, fontStyle]}>Back</Text>
      </TouchableOpacity>
      
      <Text style={[styles.timer, isDarkMode && styles.darkText, fontStyle]}>Time Left: {timeLeft}s</Text>
      <Text style={[styles.score, isDarkMode && styles.darkText, fontStyle]}>Score: {score}</Text>
      
      {/* Display the question image */}
      <Image source={{ uri: questionImage }} style={styles.questionImage} />

      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput, fontStyle]}
        placeholder="Enter your answer"
        keyboardType="numeric"
        value={userAnswer}
        onChangeText={setUserAnswer}
        placeholderTextColor={isDarkMode ? '#bbbbbb' : '#888888'}
        editable={!isAnswerIncorrect}  // Disable input if the answer is incorrect
      />
      <TouchableOpacity 
        style={[styles.button, isDarkMode && styles.darkButton]} 
        onPress={handleAnswerSubmit} 
        disabled={isAnswerIncorrect}  // Disable button if the answer is incorrect
      >
        <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText, fontStyle]}>
          Submit
        </Text>
      </TouchableOpacity>

      {/* Try Again Button */}
      {isAnswerIncorrect && (
        <TouchableOpacity style={[styles.button, isDarkMode && styles.darkButton]} onPress={handleTryAgain}>
          <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText, fontStyle]}>
            Try Again
          </Text>
        </TouchableOpacity>
      )}

      {/* Feedback Modal */}
      <Modal transparent={true} animationType="fade" visible={modalVisible}>
        <View style={[styles.modalContainer, isDarkMode && styles.darkContainer]}>
          <Animated.View style={[styles.modalContent, feedbackStyle]}>
            <Text style={[styles.modalText, isDarkMode && styles.darkText, fontStyle]}>{feedbackMessage}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={[styles.modalCloseButton, isDarkMode && styles.darkButtonText, fontStyle]}>Close</Text>
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
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#6200ee',
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  darkInput: {
    backgroundColor: '#333333',
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  darkButton: {
    backgroundColor: '#bb86fc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
    color: '#333',
  },
  modalCloseButton: {
    fontSize: 16,
    color: '#6200ee',
  },
});

export default GamePage;
