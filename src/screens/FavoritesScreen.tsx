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
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FAVORITES_KEY = 'FAVORITE_PLACES';

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState<any[]>([]);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      } else {
        setFavorites([]);
      }
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

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.address}>{item.formatted_address}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Favori Tamirciler</Text>

      <FlatList
        data={favorites}
        keyExtractor={(item, index) => item.place_id || index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>Henüz favori eklenmedi.</Text>
        }
      />

      {favorites.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearFavorites}>
          <Ionicons name="trash-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.clearText}>Favorileri Temizle</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    fontFamily: 'Montserrat-Bold',
    color: '#ff8200',
  },
  card: {
    backgroundColor: '#fff7f0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 15,
    fontFamily: 'Montserrat-Regular',
    color: '#999',
  },
  clearButton: {
    marginTop: 30,
    backgroundColor: '#ff8200', // 🔶 Uygulama turuncusu
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  clearText: {
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 15,
  },
});

export default FavoritesScreen;
