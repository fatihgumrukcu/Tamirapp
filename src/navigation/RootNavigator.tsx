import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import WelcomeScreen from '../screens/WelcomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import FinalOnboardingScreen from '../screens/FinalOnboardingScreen';
import TowOnboardingScreen from '../screens/TowOnboardingScreen';
import TabNavigator from './TabNavigator';
import RepairDetailScreen from '../screens/RepairDetailScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Onboarding: undefined;
  FinalOnboarding: undefined;
  TowOnboarding: undefined;
  Tabs: undefined;
  Detail: { place: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<null | boolean>(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (hasLaunched === null) {
        await AsyncStorage.setItem('hasLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    };
    checkFirstLaunch();
  }, []);

  if (isFirstLaunch === null) return null; // veya bir splash screen dönebilirsin

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {isFirstLaunch ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="TowOnboarding" component={TowOnboardingScreen} />
            <Stack.Screen name="FinalOnboarding" component={FinalOnboardingScreen} />
            <Stack.Screen name="Tabs" component={TabNavigator} />
          </>
        ) : (
          <>
            <Stack.Screen name="Tabs" component={TabNavigator} />
          </>
        )}
        <Stack.Screen
          name="Detail"
          component={RepairDetailScreen}
          options={{
            headerShown: true,
            title: 'Tamirci Detay',
            headerBackTitle: 'Geri Dön',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
