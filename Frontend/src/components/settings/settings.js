import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Share } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../../../ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsPage = ({ navigation }) => {
  const { isDarkMode, toggleTheme, fontStyle, updateFontStyle, globalStyles } = useTheme();

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      console.log('All data cleared from AsyncStorage');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: 'Join me in playing this amazing game! Check it out here: [Your Game Link]',
      });
      if (result.action === Share.sharedAction) {
        console.log('Shared');
      } else if (result.action === Share.dismissedAction) {
        console.log('Dismissed');
      }
    } catch (error) {
      console.error('Error sharing', error);
    }
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color={isDarkMode ? '#ffffff' : '#000000'} style={styles.backButtonIcon} />
        <Text style={[styles.backButtonText, isDarkMode && styles.darkButtonText, fontStyle]}>Back</Text>
      </TouchableOpacity>

      <Text
        style={[
          styles.settingTitle,
          globalStyles.text,
          isDarkMode ? styles.darkText : styles.lightText,
          { fontFamily: fontStyle }
        ]}
      >
        Settings
      </Text>

      <View style={styles.settingRow}>
        <Text
          style={[
            styles.settingText,
            globalStyles.text,
            isDarkMode ? styles.darkText : styles.lightText,
            { fontFamily: fontStyle }
          ]}
        >
          Dark Mode
        </Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} thumbColor="#4CAF50" />
      </View>

      <View style={styles.settingRow}>
        <Text
          style={[
            styles.settingText,
            globalStyles.text,
            isDarkMode ? styles.darkText : styles.lightText,
            { fontFamily: fontStyle }
          ]}
        >
          Font Style
        </Text>
        <Picker
          selectedValue={fontStyle}
          onValueChange={(itemValue) => updateFontStyle(itemValue)}
          style={[styles.picker, { fontFamily: fontStyle }]}
        >
          <Picker.Item label="Roboto" value="Roboto" />
          <Picker.Item label="PlayFair" value="PlayFair" />
          <Picker.Item label="IBMPlexMono" value="IBMPlexMono" />
        </Picker>
      </View>

      <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
        <Text style={[styles.shareButtonText, { fontFamily: fontStyle }]}>Share & Invite</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={[styles.logoutButtonText, { fontFamily: fontStyle }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  lightContainer: {
    backgroundColor: '#f7f8fa',
  },
  settingTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
  },
  darkText: {
    color: '#ffffff',
  },
  lightText: {
    color: '#333333',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#d3d3d3',
  },
  settingText: {
    fontSize: 18,
    fontWeight: '500',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    marginLeft: 8,
  },
  picker: {
    height: 50,
    width: 160,
    color: '#555',
  },
  shareButton: {
    marginTop: 30,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 4 },
  },
  shareButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 4 },
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsPage;
