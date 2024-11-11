import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../ThemeContext';

const Footer = () => {
  const navigation = useNavigation();
  const { isDarkMode, fontStyle } = useTheme(); // Retrieve fontStyle from the theme context

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Dashboard')}>
        <Icon name="home-outline" size={24} color={isDarkMode ? '#FFD700' : '#000000'} />
        <Text style={[styles.footerText, isDarkMode ? styles.darkText : styles.lightText, { fontFamily: fontStyle }]}>
          Dashboard
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Leaderboard')}>
        <Icon name="trophy-outline" size={24} color={isDarkMode ? '#FFD700' : '#000000'} />
        <Text style={[styles.footerText, isDarkMode ? styles.darkText : styles.lightText, { fontFamily: fontStyle }]}>
          Leaderboard
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Profile')}>
        <Icon name="person-outline" size={24} color={isDarkMode ? '#FFD700' : '#000000'} />
        <Text style={[styles.footerText, isDarkMode ? styles.darkText : styles.lightText, { fontFamily: fontStyle }]}>
          Profile
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Settings')}>
        <Icon name="settings-outline" size={24} color={isDarkMode ? '#FFD700' : '#000000'} />
        <Text style={[styles.footerText, isDarkMode ? styles.darkText : styles.lightText, { fontFamily: fontStyle }]}>
          Settings
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  footerItem: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    marginTop: 2,
  },
  lightText: {
    color: '#000000',
  },
  darkText: {
    color: '#FFD700',
  },
});

export default Footer;
