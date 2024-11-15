import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Animated, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../ThemeContext';
import * as Progress from 'react-native-progress';
import LottieView from 'lottie-react-native';

const GamePage = ({ route, navigation }) => {
  const { timeLimit } = route.params;
  const { isDarkMode, fontStyle } = useTheme();
  const [questionImage, setQuestionImage] = useState('');
  const [solution, setSolution] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isAnswerIncorrect, setIsAnswerIncorrect] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const timerRef = React.useRef(null);
  const successOpacity = useState(new Animated.Value(0))[0]; // Opacity for smooth transition

  useEffect(() => {
    fetchQuestion();
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      showFeedback(`Game Over! Your score is ${score}`, true);
      navigation.navigate('Dashboard');
    }
  }, [timeLeft]);

  const startTimer = () => {
    timerRef.current = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
  };

  const pauseTimer = () => {
    clearInterval(timerRef.current);
  };

  const resetTimer = () => {
    setTimeLeft(timeLimit);
    startTimer();
  };

  const getToken = async () => await AsyncStorage.getItem('token');

  const fetchQuestion = async () => {
    try {
      const response = await axios.get('https://marcconrad.com/uob/banana/api.php');
      console.log('Question fetched:', response.data);
      setQuestionImage(response.data.question);
      setSolution(response.data.solution);
      setUserAnswer('');
      setIsAnswerIncorrect(false);
      setFeedbackMessage('');
      setIsSubmitDisabled(false);
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  const updatePoints = async (pointType) => {
    try {
      const token = await getToken();
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const pointsUpdate = {
        YellowPoints: pointType === 'YellowPoints' ? 1 : 0,
        SilverPoints: pointType === 'SilverPoints' ? 1 : 0,
        GoldPoints: pointType === 'GoldPoints' ? 1 : 0,
        SuccessfulAttempts: 1,
      };

      await axios.put(
        `http://192.168.164.70:5000/api/user/${userId}/updatePoints`,
        { pointsUpdate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Failed to update points:", error.response?.data || error.message);
    }
  };

  const handleAnswerSubmit = () => {
    if (parseInt(userAnswer) === solution) {
      setScore(score + 1);
      setStreak(streak + 1);
      setShowSuccessAnimation(true);
      pauseTimer();

      // Show success animation and message, then load new question after 2 seconds
      setTimeout(() => {
        setShowSuccessAnimation(false);
        fetchQuestion();
        resetTimer();
      }, 2000);

      const pointType = timeLimit === 60 ? "YellowPoints" : timeLimit === 45 ? "SilverPoints" : "GoldPoints";
      updatePoints(pointType);
    } else {
      setFeedbackMessage(`Incorrect! Correct answer: ${solution}`);
      setStreak(0);
      setIsAnswerIncorrect(true);
      setIsSubmitDisabled(true);
      pauseTimer();
    }
    setUserAnswer('');
  };

  const handleTryAgain = () => {
    fetchQuestion();
    resetTimer();
  };

  const showFeedback = (message) => {
    setFeedbackMessage(message);
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color={isDarkMode ? '#ffffff' : '#000000'} style={styles.backButtonIcon} />
        <Text style={[styles.backButtonText, isDarkMode && styles.darkButtonText, fontStyle]}>Back</Text>
      </TouchableOpacity>

      {showSuccessAnimation ? (
        <View style={styles.successAnimationContainer}>
          <LottieView source={require('../../../assets/success.json')} autoPlay loop={false} style={styles.lottieAnimation} />
          <Text style={styles.successText}>Your answer was correct!</Text>
        </View>
      ) : (
        <>
          <View style={styles.scoreboard}>
            <Text style={[styles.scoreText, isDarkMode && styles.darkText, fontStyle]}>Score: {score}</Text>
            <Text style={[styles.streakText, isDarkMode && styles.darkText, fontStyle]}>Streak: {streak}</Text>
          </View>

          {feedbackMessage && (
            <View style={styles.feedbackMessage}>
              <Text style={styles.feedbackText}>{feedbackMessage}</Text>
            </View>
          )}

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
            editable={!isSubmitDisabled}
          />

          <TouchableOpacity
            style={[styles.button, isDarkMode && styles.darkButton]}
            onPress={handleAnswerSubmit}
            disabled={isSubmitDisabled}
          >
            <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText, fontStyle]}>
              Submit
            </Text>
          </TouchableOpacity>

          {isAnswerIncorrect && (
            <TouchableOpacity style={styles.tryAgainButton} onPress={handleTryAgain}>
              <Text style={styles.tryAgainText}>Try Again</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  feedbackMessage: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  feedbackText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
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
  tryAgainButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ff4444',
    borderRadius: 8,
    alignItems: 'center',
  },
  tryAgainText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  fullScreenAnimation: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    fontSize: 24,
    color: '#4caf50',
    fontWeight: '700',
    marginTop: 20,
},
backButton: {
  flexDirection: 'row',
  alignItems: 'center',
 paddingBottom:100,
},
backButtonIcon: {
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
});

export default GamePage;
