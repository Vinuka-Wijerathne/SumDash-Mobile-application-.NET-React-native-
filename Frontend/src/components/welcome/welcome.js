import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'; // Use Image for asset images

const Welcome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Background image from assets */}
      <Image source={require('../../../assets/game.png')} style={styles.backgroundImage} />

      <View style={styles.overlay}>
        <Text style={styles.logo}>SumDash</Text>
        <Text style={styles.description}>
          Welcome to SumDash! Dive into the ultimate gaming experience where you test your skills and push your limits.
          Choose your level, complete challenging tasks, and track your progress. Join the adventure now!
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.signupButton]}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute', // Ensure it stays in the background
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Light overlay for light mode
    width: '100%',
    height: '100%',
    padding: 20,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 18,
    color: '#333', // Dark color for light mode
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 30,
  },
  button: {
    backgroundColor: '#F5D300',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 20,
  },
  signupButton: {
    backgroundColor: '#3D65C4',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Welcome;
