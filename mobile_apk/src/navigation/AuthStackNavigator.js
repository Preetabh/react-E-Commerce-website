import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserLoginScreen from '../screens/user/UserLoginScreen';
import UserRegisterScreen from '../screens/user/UserRegisterScreen';
import OwnerLoginScreen from '../screens/owner/OwnerLoginScreen';
import OwnerRegisterScreen from '../screens/owner/OwnerRegisterScreen';
import ForgotPasswordScreen from '../screens/user/ForgotPasswordScreen';

const Stack = createStackNavigator();

export default function AuthStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserLogin" component={UserLoginScreen} />
      <Stack.Screen name="UserRegister" component={UserRegisterScreen} />
      <Stack.Screen name="OwnerLogin" component={OwnerLoginScreen} />
      <Stack.Screen name="OwnerRegister" component={OwnerRegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
