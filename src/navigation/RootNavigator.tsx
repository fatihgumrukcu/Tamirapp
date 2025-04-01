// src/navigation/RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import FinalOnboardingScreen from '../screens/FinalOnboardingScreen'; // ✅ 3. ekran eklendi
import TabNavigator from './TabNavigator';
import RepairDetailScreen from '../screens/RepairDetailScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Onboarding: undefined;
  FinalOnboarding: undefined; // ✅ Yeni rota
  Tabs: undefined;
  Detail: { place: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="FinalOnboarding" component={FinalOnboardingScreen} /> 
        <Stack.Screen name="Tabs" component={TabNavigator} />
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
