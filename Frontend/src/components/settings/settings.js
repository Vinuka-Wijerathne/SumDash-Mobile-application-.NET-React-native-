import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Importing from the new package

const SettingsPage = ({ onLogout }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [fontStyle, setFontStyle] = useState('normal');

    const toggleDarkMode = () => {
        setIsDarkMode(previousState => !previousState);
    };

    return (
        <View style={[styles.container, isDarkMode && styles.darkContainer]}>
            <View style={styles.settingsContainer}>
                <Text style={[styles.settingTitle, isDarkMode && styles.darkText]}>Settings</Text>

                <View style={styles.settingRow}>
                    <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>Dark Mode</Text>
                    <Switch
                        value={isDarkMode}
                        onValueChange={toggleDarkMode}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
                    />
                </View>

                <View style={styles.settingRow}>
                    <Text style={[styles.settingLabel, isDarkMode && styles.darkText]}>Font Style</Text>
                    <Picker
                        selectedValue={fontStyle}
                        style={[styles.picker, isDarkMode && styles.darkInput]}
                        onValueChange={(itemValue) => setFontStyle(itemValue)}
                    >
                        <Picker.Item label="Normal" value="normal" />
                        <Picker.Item label="Italic" value="italic" />
                        <Picker.Item label="Bold" value="bold" />
                        <Picker.Item label="Underline" value="underline" />
                    </Picker>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={[styles.footerText, isDarkMode && styles.darkText]}>© 2024 Your App</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    darkContainer: {
        backgroundColor: '#333',
    },
    settingsContainer: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    settingTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    settingLabel: {
        fontSize: 18,
        marginBottom: 10,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    picker: {
        height: 50,
        width: 150,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    darkInput: {
        backgroundColor: '#555',
        color: '#fff',
    },
    logoutButton: {
        marginTop: 30,
        backgroundColor: '#ff4d4d',
        padding: 12,
        borderRadius: 30,
        alignItems: 'center',
        width: 300,
        alignSelf: 'center',
    },
    logoutText: {
        color: '#fff',
        fontSize: 18,
    },
    footer: {
        paddingVertical: 10,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
    },
    darkText: {
        color: '#fff',
    },
});

export default SettingsPage;
