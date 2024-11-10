import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Ensure you have this installed
import { useTheme } from '../../../ThemeContext'; // Ensure the path is correct
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsPage = ({ navigation }) => {
  const { isDarkMode, toggleTheme, fontStyle, updateFontStyle, globalStyles } = useTheme();

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      console.log('All data cleared from AsyncStorage');
      navigation.navigate('login');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text
          style={[
            styles.backButtonText,
            globalStyles.text,
            isDarkMode ? styles.darkText : styles.lightText,
            { fontFamily: fontStyle } // Apply fontStyle dynamically here
          ]}
        >
          Back
        </Text>
      </TouchableOpacity>

      <Text
        style={[
          styles.settingTitle,
          globalStyles.text,
          isDarkMode ? styles.darkText : styles.lightText,
          { fontFamily: fontStyle } // Apply fontStyle dynamically here
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
            { fontFamily: fontStyle } // Apply fontStyle dynamically here
          ]}
        >
          Dark Mode
        </Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>

      <View style={styles.settingRow}>
        <Text
          style={[
            styles.settingText,
            globalStyles.text,
            isDarkMode ? styles.darkText : styles.lightText,
            { fontFamily: fontStyle } // Apply fontStyle dynamically here
          ]}
        >
          Font Style
        </Text>
        <Picker
          selectedValue={fontStyle}
          onValueChange={(itemValue) => updateFontStyle(itemValue)}
          style={[styles.picker, { fontFamily: fontStyle }]} // Apply fontStyle dynamically here as well
        >
          <Picker.Item label="Roboto" value="Roboto" />
          <Picker.Item label="PlayFair" value="PlayFair" />
          <Picker.Item label="IBMPlexMono" value="IBMPlexMono" />
          {/* Add more font options if needed */}
        </Picker>
      </View>

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
    backgroundColor: '#333',
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  settingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  darkText: {
    color: '#fff',
  },
  lightText: {
    color: '#000',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  settingText: {
    fontSize: 18,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backButtonText: {
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: 150,
    color: '#000',
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FF3B30',
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsPage;
