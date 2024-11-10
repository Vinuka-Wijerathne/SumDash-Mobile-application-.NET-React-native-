import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font'; // Import the expo-font hook
import { ThemeProvider, useTheme } from './ThemeContext'; // Import the ThemeProvider and useTheme
import SettingsPage from './src/components/settings/settings';
import LoginPage from './src/components/login/login';
import SignUpPage from './src/components/signup/signup';
import GamePage from './src/components/game/game';
import DashboardPage from './src/components/dashboard/dashboard';
import ProfilePage from './src/components/profile/profile';
import LeaderboardPage from './src/components/leaderboard/leaderboard';

const Stack = createStackNavigator();

const App = () => {
  const [fontsLoaded] = useFonts({
    'Roboto': require('./assets/fonts/Roboto.ttf'),
    'PlayFair': require('./assets/fonts/Playfair.ttf'), // Ensure the path is correct
    'IBMPlexMono': require('./assets/fonts/IBMPlexMono.ttf'),
    
  });

  if (!fontsLoaded) {
    return null; // Or a loading screen, depending on your needs
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <AppNavigation />
      </NavigationContainer>
    </ThemeProvider>
  );
};

const AppNavigation = () => {
  const { fontStyle } = useTheme(); // Get the selected font style
  return (
    <Stack.Navigator initialRouteName="login">
      <Stack.Screen
        name="login"
        component={LoginPage}
        options={{
          headerShown: false,
          headerStyle: { fontFamily: fontStyle }, // Apply the selected font to the header
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpPage}
        options={{
          headerShown: false,
          headerStyle: { fontFamily: fontStyle },
        }}
      />
      <Stack.Screen
        name="Game"
        component={GamePage}
        options={{
          headerShown: false,
          headerStyle: { fontFamily: fontStyle },
        }}
      />
      <Stack.Screen
        name="Dashboard"
        component={DashboardPage}
        options={{
          headerShown: false,
          headerStyle: { fontFamily: fontStyle },
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          headerShown: false,
          headerStyle: { fontFamily: fontStyle },
        }}
      />
      <Stack.Screen
        name="Leaderboard"
        component={LeaderboardPage}
        options={{
          headerShown: false,
          headerStyle: { fontFamily: fontStyle },
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsPage}
        options={{
          headerShown: false,
          headerStyle: { fontFamily: fontStyle },
        }}
      />
    </Stack.Navigator>
  );
};

export default App;
