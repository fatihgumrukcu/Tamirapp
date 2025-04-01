// src/navigation/RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen'; // 👈 Eklendi
import TabNavigator from './TabNavigator';
import RepairDetailScreen from '../screens/RepairDetailScreen';

export type RootStackParamList = {
  Welcome: undefined;
  MainTabs: undefined;
  Detail: { place: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen
          name="Detail"
          component={RepairDetailScreen}
          options={{ headerShown: true, title: 'Tamirci Detay' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
