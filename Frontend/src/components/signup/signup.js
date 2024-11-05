import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios'; // Import Axios
import Lottie from 'lottie-react-native'; // Import Lottie

const SignUpPage = ({ navigation }) => { // Receive navigation prop
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (name && email && password) {
      try {
        const response = await axios.post('http://192.168.8.105:5247/api/Auth/signup', {
          Username: name,
          Email: email,
          PasswordHash: password,  
        });

        Alert.alert('Sign Up Successful', response.data, [
          {
            text: 'OK',
            onPress: () => navigation.navigate('login'), 
          },
        ]);
      } catch (error) {
        if (error.response && error.response.data) {
          console.error('Error during signup:', error.response.data.errors);
          Alert.alert('Sign Up Failed', error.response.data.title || 'Validation error');
        } else {
          Alert.alert('Sign Up Failed', 'An unexpected error occurred.');
        }
      }
    } else {
      Alert.alert('Sign Up Failed', 'Please fill all the fields.');
    }
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Add Lottie animation here */}
      <Lottie 
        source={require('../../../assets/signup.json')} 
        autoPlay 
        loop 
        style={styles.animation}
      />
      <Text style={styles.title}>Create Your Account</Text>
      <Text style={styles.subtitle}>Join us and start your journey with Sumdash!</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCompleteType="email"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('login')}> 
          <Text style={styles.linkText}> Login</Text>
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
    width: '100%',
    height: 200, // Adjust height as necessary
    marginBottom: 24, // Space below the animation
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#6200ea',
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
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    height: 50,
    backgroundColor: '#6200ea',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
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
  linkText: {
    color: '#6200ea',
    fontSize: 16,
  },
});

export default SignUpPage;
