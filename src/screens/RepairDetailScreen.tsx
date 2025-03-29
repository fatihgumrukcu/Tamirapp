import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PlaceType = {
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: { open_now?: boolean };
  photos?: { photo_reference: string }[];
  place_id: string;
};

type RouteParams = {
  params: { place: PlaceType };
};

const GOOGLE_API_KEY = 'AIzaSyAhX_qab75bK7JSEhHxnTHh9E32jpoO9YI'; // ← Buraya kendi API key’inizi koyun

const getPhotoUrl = (ref: string) =>
  `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${GOOGLE_API_KEY}`;

const FAVORITES_KEY = 'FAVORITE_PLACES';

const RepairDetailScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const place = route.params.place;

  const [reviews, setReviews] = useState<
    { author_name: string; text: string }[]
  >([]);
  const [isFavorite, setIsFavorite] = useState(false);

  // 🚀 Yorumları çek
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=reviews&key=${GOOGLE_API_KEY}`;
        const response = await axios.get(url);
        if (response.data.result?.reviews) {
          setReviews(response.data.result.reviews);
        }
      } catch (error) {
        console.error('❌ Yorumlar alınamadı:', error);
      }
    };

    fetchReviews();
    checkIfFavorite();
  }, []);

  // ✅ Favori kontrolü
  const checkIfFavorite = async () => {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    const favorites = json ? JSON.parse(json) : [];
    const exists = favorites.some((item: PlaceType) => item.place_id === place.place_id);
    setIsFavorite(exists);
  };

  const toggleFavorite = async () => {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    const favorites = json ? JSON.parse(json) : [];

    const exists = favorites.some((item: PlaceType) => item.place_id === place.place_id);
    let updated = [];

    if (exists) {
      updated = favorites.filter((item: PlaceType) => item.place_id !== place.place_id);
      Alert.alert('Favorilerden çıkarıldı');
    } else {
      updated = [...favorites, place];
      Alert.alert('Favorilere eklendi');
    }

    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    setIsFavorite(!exists);
  };

  const openInMaps = () => {
    const query = encodeURIComponent(`${place.name} ${place.formatted_address}`);
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${query}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{place.name}</Text>

      {place.photos?.[0]?.photo_reference && (
        <Image
          source={{ uri: getPhotoUrl(place.photos[0].photo_reference) }}
          style={styles.image}
        />
      )}

      <Text style={styles.info}>📍 {place.formatted_address}</Text>

      {place.rating && (
        <Text style={styles.info}>
          ⭐ {place.rating} ({place.user_ratings_total} yorum)
        </Text>
      )}

      {place.opening_hours?.open_now !== undefined && (
        <Text style={styles.info}>
          🕒 {place.opening_hours.open_now ? 'Şu anda açık' : 'Şu anda kapalı'}
        </Text>
      )}

      <TouchableOpacity style={styles.button} onPress={openInMaps}>
        <Text style={styles.buttonText}>Yol Tarifi Al</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isFavorite ? '#ff3b30' : '#34c759' },
        ]}
        onPress={toggleFavorite}
      >
        <Text style={styles.buttonText}>
          {isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.reviewsTitle}>Kullanıcı Yorumları</Text>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <View key={index} style={styles.reviewCard}>
            <Text style={styles.reviewAuthor}>👤 {review.author_name}</Text>
            <Text style={styles.reviewText}>"{review.text}"</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noReviews}>Yorum bulunamadı.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fefefe',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  info: {
    fontSize: 16,
    marginBottom: 6,
  },
  button: {
    backgroundColor: '#0a84ff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 14,
  },
  reviewCard: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  reviewAuthor: {
    fontWeight: '600',
    fontSize: 14,
  },
  reviewText: {
    fontSize: 14,
    marginTop: 4,
    fontStyle: 'italic',
  },
  noReviews: {
    fontSize: 14,
    color: '#666',
  },
});

export default RepairDetailScreen;
