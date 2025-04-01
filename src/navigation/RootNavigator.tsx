// src/navigation/RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import FinalOnboardingScreen from '../screens/FinalOnboardingScreen';
import TabNavigator from './TabNavigator';
import RepairDetailScreen from '../screens/RepairDetailScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Onboarding: undefined;
  FinalOnboarding: undefined;
  Tabs: undefined;
  Detail: { place: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ animation: 'fade_from_bottom' }} // 1️⃣
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ animation: 'slide_from_right' }} // 2️⃣
      />
      <Stack.Screen
        name="FinalOnboarding"
        component={FinalOnboardingScreen}
        options={{ animation: 'slide_from_bottom' }} // 3️⃣
      />
      <Stack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{ animation: 'simple_push' }} // Ana uygulamaya geçiş daha doğal
      />
      <Stack.Screen
        name="Detail"
        component={RepairDetailScreen}
        options={{
          headerShown: true,
          title: 'Tamirci Detay',
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
  );  
};

export default RootNavigator;
