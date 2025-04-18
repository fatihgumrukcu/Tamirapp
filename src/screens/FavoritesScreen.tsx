import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useTheme } from '../context/ThemeContext';

const FAVORITES_KEY = 'FAVORITE_PLACES';

const FavoritesScreen = () => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [favorites, setFavorites] = useState<any[]>([]);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      setFavorites(stored ? JSON.parse(stored) : []);
    } catch (error) {
      console.error('Favoriler yüklenemedi:', error);
    }
  };

  const clearFavorites = async () => {
    try {
      await AsyncStorage.removeItem(FAVORITES_KEY);
      setFavorites([]);
    } catch (error) {
      console.error('Favoriler silinemedi:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const renderItem = ({ item }: { item: any }) => {
    const name = item.found_name || item.name || 'İsimsiz';
    const address = item.formatted_address || 'Adres bilinmiyor';
    
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Detail', { place: item })}
        style={[
          styles.card,
          {
            backgroundColor: '#ff8200',
            shadowColor: isDarkMode ? '#000' : '#b35c00',
          },
        ]}
      >
        <Text style={[styles.name, { color: '#fff' }]}>{name}</Text>
        <Text style={[styles.address, { color: '#fff' }]}>{address}</Text>
      </TouchableOpacity>
    );
  };
  

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && { backgroundColor: '#000' }]}
    >
      <Text style={[styles.title, isDarkMode && { color: '#fff' }]}>
        Favori Tamirciler
      </Text>

      <FlatList
        data={favorites}
        keyExtractor={(item, index) => item.place_id || index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={[styles.empty, isDarkMode && { color: '#bbb' }]}>
            Henüz favori eklenmedi.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      {favorites.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearFavorites}>
          <Text style={styles.clearText}>Favorileri Temizle</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    marginBottom: 24,
    color: '#111',
  },
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontFamily: 'Montserrat-Regular',
  },
  clearButton: {
    marginTop: 5,
    marginBottom: 25,
    paddingVertical: 12,
    backgroundColor: '#ff8200',
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#ff8200',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  clearText: {
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 15,
  },
});

export default FavoritesScreen;
