import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage('Please enter both email and password');
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post('http://192.168.58.70:5000/api/Auth/login', {
        email,
        passwordHash: password,
      });
  
      if (response.status === 200) {
        const { token, user } = response.data;
  
        // Store the token and user ID in AsyncStorage
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('userId', user.id);
        console.log('Login successful. Token and user ID saved to AsyncStorage:', token, user.id);
  
        // Retrieve and log to verify saving
        const savedToken = await AsyncStorage.getItem('token');
        const savedUserId = await AsyncStorage.getItem('userId');
        console.log('Retrieved token from AsyncStorage:', savedToken);
        console.log('Retrieved userId from AsyncStorage:', savedUserId);
  
        // Navigate to the Dashboard
        navigation.navigate('Dashboard');
      } else {
        setMessage('Login failed. Please try again.');
      }
    } catch (error) {
      setMessage('Login failed. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Lottie animation */}
      <LottieView
        source={require('../../../assets/signup.json')}
        autoPlay
        loop
        style={styles.animation}
      />

      <Text style={styles.title}>Login to SumDash</Text>
      <Text style={styles.subtitle}>Please enter your credentials below</Text>

      {/* Email input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888"
      />

      {/* Password input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />

      {/* Login button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>

      {/* Error message */}
      {message ? <Text style={styles.message}>{message}</Text> : null}

      {/* Forgot password link */}
      <TouchableOpacity onPress={() => alert('Forgot password functionality here')} style={styles.linkContainer}>
        <Text style={styles.linkText}>Forgot your password?</Text>
      </TouchableOpacity>

      {/* Footer with SignUp link */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.linkText}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  animation: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#555',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  button: {
    height: 50,
    backgroundColor: '#FFDD00',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 20,
  },
  linkContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#6200ea',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#555',
  },
});

export default LoginPage;
