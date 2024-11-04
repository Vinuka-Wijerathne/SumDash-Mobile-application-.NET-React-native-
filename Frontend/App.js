import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsPage from './src/components/settings/settings';
import LoginPage from './src/components/login/login';
import SignUpPage from './src/components/signup/signup';
import GamePage from './src/components/game/game';
import DashboardPage from './src/components/dashboard/dashboard';
import ProfilePage from './src/components/profile/profile';
import LeaderboardPage from './src/components/leaderboard/leaderboard';
import { ThemeProvider } from './ThemeContext'; // Import the ThemeProvider

const Stack = createStackNavigator();



const App = () => {
  return (
    <ThemeProvider>
      <NavigationContainer >
        <Stack.Navigator initialRouteName="login">
          <Stack.Screen name="login" component={LoginPage} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUpPage} options={{ headerShown: false }} />
          <Stack.Screen name="Game" component={GamePage} options={{ headerShown: false }} />
          <Stack.Screen name="Dashboard" component={DashboardPage} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={ProfilePage} options={{ headerShown: false }} />
          <Stack.Screen name="Leaderboard" component={LeaderboardPage} options={{ headerShown: false }} />
          <Stack.Screen name="Settings" component={SettingsPage} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
