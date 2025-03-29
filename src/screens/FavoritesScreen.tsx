import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const FAVORITES_KEY = 'FAVORITE_PLACES';

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState<any[]>([]);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
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

  useEffect(() => {
    loadFavorites();
  }, []);

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
        ListEmptyComponent={<Text style={styles.empty}>Henüz favori eklenmedi.</Text>}
      />

      <TouchableOpacity style={styles.clearButton} onPress={clearFavorites}>
        <Text style={styles.clearText}>Favorileri Temizle</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: { fontSize: 16, fontWeight: 'bold' },
  address: { fontSize: 14, color: '#555' },
  empty: { textAlign: 'center', marginTop: 40, color: '#777' },
  clearButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    alignItems: 'center',
  },
  clearText: { color: '#fff', fontWeight: '600' },
});

export default FavoritesScreen;
