import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Animated, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../ThemeContext';
import * as Progress from 'react-native-progress';

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
  const [isAnswerIncorrect, setIsAnswerIncorrect] = useState(false);

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
    console.log('Token:', token);
    return token;
  };

  const fetchQuestion = async () => {
    try {
      console.log('Fetching question...');
      const response = await axios.get('https://marcconrad.com/uob/banana/api.php');
      console.log('Question fetched:', response.data);
      setQuestionImage(response.data.question);
      setSolution(response.data.solution);
      setUserAnswer('');
      setIsAnswerIncorrect(false);
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  const getUserId = async () => {
    const userId = await AsyncStorage.getItem('userId');
    console.log('User ID:', userId);
    return userId;
  };

  const updatePoints = async (pointType) => {
    try {
      const token = await getToken();
      const userId = await getUserId();
      if (!userId) {
        console.error("User ID is missing");
        return;
      }

      const pointsUpdate = {
        YellowPoints: 0,
        SilverPoints: 0,
        GoldPoints: 0,
        SuccessfulAttempts: 1,
      };

      if (pointType === "YellowPoints") {
        pointsUpdate.YellowPoints = 1;
      } else if (pointType === "SilverPoints") {
        pointsUpdate.SilverPoints = 1;
      } else if (pointType === "GoldPoints") {
        pointsUpdate.GoldPoints = 1;
      }

      const payload = {
        pointsUpdate,
      };

      console.log('Updating points with payload:', payload);

      const response = await axios.put(
        `http://192.168.164.70:5000/api/user/${userId}/updatePoints`,
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

  const handleAnswerSubmit = () => {
    console.log('User answer submitted:', userAnswer);
    if (parseInt(userAnswer) === solution) {
      console.log('Correct answer!');
      setScore(score + 1);
      setTimeLeft(timeLimit);
      showFeedback('Correct Answer!', false);
      fetchQuestion();

      const pointType = timeLimit === 60 ? "YellowPoints" :
                        timeLimit === 45 ? "SilverPoints" : "GoldPoints";

      updatePoints(pointType);
    } else {
      console.log('Incorrect answer.');
      showFeedback(`Incorrect Answer! The correct answer is ${solution}`, true);
      setIsAnswerIncorrect(true);
    }
    setUserAnswer('');
  };

  const showFeedback = (message, isError) => {
    console.log('Feedback message:', message);
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

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('../../../assets/back.png')} style={styles.backButtonImage} />
        <Text style={[styles.backButtonText, isDarkMode && styles.darkButtonText, fontStyle]}>Back</Text>
      </TouchableOpacity>

      <View style={styles.scoreboard}>
        <Text style={[styles.scoreText, isDarkMode && styles.darkText, fontStyle]}>Score: {score}</Text>
      </View>
      
      <View style={styles.timerContainer}>
        <Progress.Circle
          size={100}
          progress={timeLeft / timeLimit}
          showsText={true}
          formatText={() => timeLeft.toString()}
          color="#ff4444"
          thickness={8}
          textStyle={{ fontSize: 24, color: isDarkMode ? '#ffff00' : '#ff4444' }}
          borderWidth={2}
          borderColor={isDarkMode ? '#ffffff' : '#000000'}
          unfilledColor={isDarkMode ? '#555555' : '#eeeeee'}
        />
      </View>

      <Image source={{ uri: questionImage }} style={styles.questionImage} />

      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput, fontStyle]}
        placeholder="Enter your answer"
        keyboardType="numeric"
        value={userAnswer}
        onChangeText={setUserAnswer}
        placeholderTextColor={isDarkMode ? '#bbbbbb' : '#888888'}
        editable={!isAnswerIncorrect}
      />
      
      <TouchableOpacity 
        style={[styles.button, isDarkMode && styles.darkButton]} 
        onPress={handleAnswerSubmit} 
        disabled={isAnswerIncorrect}
      >
        <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText, fontStyle]}>
          Submit
        </Text>
      </TouchableOpacity>

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
    marginBottom: 20,
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
  scoreboard: {
    alignItems: 'center',
    backgroundColor: '#eeeeee',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: '700',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  questionImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
  },
  darkInput: {
    backgroundColor: '#333333',
    borderColor: '#555555',
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  darkButton: {
    backgroundColor: '#3030cc',
  },
  buttonText: {
    color: '#ffffff',
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
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 20,
  },
  modalCloseButton: {
    fontSize: 16,
    color: '#6200ee',
  },
});

export default GamePage;
