import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserTabNavigator from './UserTabNavigator';
import OwnerTabNavigator from './OwnerTabNavigator';
import AuthStackNavigator from './AuthStackNavigator';

import ProductDetailScreen from '../screens/user/ProductDetailScreen';
import CheckoutScreen from '../screens/user/CheckoutScreen';
import OrderSuccessScreen from '../screens/user/OrderSuccessScreen';
import EditUserProfileScreen from '../screens/user/EditUserProfileScreen';
import AiCenterScreen from '../screens/user/AiCenterScreen';

import OwnerAddProductScreen from '../screens/owner/OwnerAddProductScreen';
import OwnerEditProductScreen from '../screens/owner/OwnerEditProductScreen';
import StaticInfoScreen from '../screens/static/StaticInfoScreen';
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from '../context/AuthContext';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { role, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingSpinner message="Starting Shop Mart Mobile..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={role === 'owner' ? 'OwnerTab' : 'UserTab'}
        screenOptions={{ headerShown: false }}
      >
        {/* Main Tab Screens */}
        <Stack.Screen name="UserTab" component={UserTabNavigator} />
        <Stack.Screen name="OwnerTab" component={OwnerTabNavigator} />
        <Stack.Screen name="AuthStack" component={AuthStackNavigator} />

        {/* User Detail & Action Screens */}
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
        <Stack.Screen name="EditUserProfile" component={EditUserProfileScreen} />
        <Stack.Screen name="AiCenter" component={AiCenterScreen} />

        {/* Owner Detail & Action Screens */}
        <Stack.Screen name="OwnerAddProduct" component={OwnerAddProductScreen} />
        <Stack.Screen name="OwnerEditProduct" component={OwnerEditProductScreen} />

        {/* Static Info Screen */}
        <Stack.Screen name="Terms" component={StaticInfoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
