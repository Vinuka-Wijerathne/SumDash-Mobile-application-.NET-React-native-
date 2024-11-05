// src/components/settings/settings.js
import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Ensure you have this installed
import { useTheme } from '../../../ThemeContext'; // Ensure the path is correct

const SettingsPage = ({ navigation }) => {
    const { isDarkMode, toggleTheme, fontStyle, updateFontStyle } = useTheme();

    const handleLogout = () => {
        // Add your logout logic here, such as clearing tokens or user data
        navigation.navigate('login'); // Redirect to login page after logout
    };

    return (
        <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={[styles.backButtonText, isDarkMode ? styles.darkText : styles.lightText]}>Back</Text>
            </TouchableOpacity>

            <Text style={[styles.settingTitle, isDarkMode ? styles.darkText : styles.lightText]}>Settings</Text>

            <View style={styles.settingRow}>
                <Text style={[styles.settingText, isDarkMode ? styles.darkText : styles.lightText]}>Dark Mode</Text>
                <Switch value={isDarkMode} onValueChange={toggleTheme} />
            </View>

            <View style={styles.settingRow}>
                <Text style={[styles.settingText, isDarkMode ? styles.darkText : styles.lightText]}>Font Style</Text>
                <Picker
                    selectedValue={fontStyle}
                    onValueChange={(itemValue) => updateFontStyle(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Normal" value="normal" />
                    <Picker.Item label="Italic" value="italic" />
                    <Picker.Item label="Bold" value="bold" />
                    <Picker.Item label="Underline" value="underline" />
                </Picker>
            </View>

            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Logout</Text>
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
        color: '#fff', // White text for dark mode
    },
    lightText: {
        color: '#000', // Black text for light mode
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
        // Color will change based on mode now
    },
    picker: {
        height: 50,
        width: 150,
        color: '#000', // Default color for picker text
        // Use a separate style for dark mode if necessary
    },
    logoutButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#FF3B30', // Change to your desired color
        borderRadius: 5,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16, 
        fontWeight: 'bold',
    },
});

export default SettingsPage;
 