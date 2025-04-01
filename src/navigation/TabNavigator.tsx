// src/navigation/TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: '#ffffff',
      tabBarInactiveTintColor: '#ffddbb',
      tabBarBackground: () => <View style={styles.tabBackground} />,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = '';

        if (route.name === 'Anasayfa') iconName = focused ? 'home' : 'home-outline';
        else if (route.name === 'Ayarlar') iconName = focused ? 'settings' : 'settings-outline';
        else if (route.name === 'Favorilerim') iconName = focused ? 'heart' : 'heart-outline';

        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Anasayfa" component={HomeScreen} />
    <Tab.Screen name="Favorilerim" component={FavoritesScreen} />
    <Tab.Screen name="Ayarlar" component={SettingsScreen} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ff8200',
    borderTopWidth: 0,
    height: 70,
    paddingBottom: 10,
    paddingTop: 6,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
  },
  tabBackground: {
    flex: 1,
    backgroundColor: '#ff8200',
  },
});

export default TabNavigator;
