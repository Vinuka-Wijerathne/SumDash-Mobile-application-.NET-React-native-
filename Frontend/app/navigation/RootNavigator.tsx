import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from '../components/login/login';
import SignUpPage from '../components/signup/signup';  // Adjust the path as needed

const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginPage}
        options={{ headerShown: false }}  // You can style the header as per your needs
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpPage}
        options={{ headerShown: false }}  // You can style the header as per your needs
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
