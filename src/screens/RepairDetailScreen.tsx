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
  useColorScheme,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

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

const GOOGLE_API_KEY = 'AIzaSyAhX_qab75bK7JSEhHxnTHh9E32jpoO9YI';
const getPhotoUrl = (ref: string) =>
  `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${GOOGLE_API_KEY}`;

const FAVORITES_KEY = 'FAVORITE_PLACES';

const RepairDetailScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const place = route.params.place;

  const [reviews, setReviews] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=reviews&key=${GOOGLE_API_KEY}`;
        const response = await axios.get(url);
        if (response.data.result?.reviews) {
          setReviews(response.data.result.reviews);
        }
      } catch (error) {
        console.error('Yorumlar alınamadı:', error);
      }
    };

    fetchReviews();
    checkIfFavorite();
  }, []);

  const checkIfFavorite = async () => {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    const favorites = json ? JSON.parse(json) : [];
    const exists = favorites.some((item: PlaceType) => item.place_id === place.place_id);
    setIsFavorite(exists);
  };

  const toggleFavorite = async () => {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    const favorites = json ? JSON.parse(json) : [];
    let updated = [];

    if (isFavorite) {
      updated = favorites.filter((item: PlaceType) => item.place_id !== place.place_id);
      Alert.alert('Favorilerden çıkarıldı');
    } else {
      updated = [...favorites, place];
      Alert.alert('Favorilere eklendi');
    }

    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  const openInMaps = () => {
    const query = encodeURIComponent(`${place.name} ${place.formatted_address}`);
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${query}`);
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        isDarkMode && { backgroundColor: '#121212' },
      ]}
    >
      <Text style={[styles.title, isDarkMode && { color: '#fff' }]}>{place.name}</Text>

      {place.photos?.[0]?.photo_reference && (
        <Image
          source={{ uri: getPhotoUrl(place.photos[0].photo_reference) }}
          style={styles.image}
        />
      )}

      <Text style={[styles.info, isDarkMode && { color: '#ccc' }]}>
        Adres: {place.formatted_address}
      </Text>

      {place.rating && (
        <Text style={[styles.info, isDarkMode && { color: '#ccc' }]}>
          Puan: {place.rating} ({place.user_ratings_total} yorum)
        </Text>
      )}

      {place.opening_hours?.open_now !== undefined && (
        <Text style={[styles.info, isDarkMode && { color: '#ccc' }]}>
          Durum: {place.opening_hours.open_now ? 'Açık' : 'Kapalı'}
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isDarkMode ? '#0a84ff' : '#0a84ff' },
        ]}
        onPress={openInMaps}
      >
        <Text style={[styles.buttonText, { color: '#fff' }]}>Yol Tarifi Al</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: '#ff8200' },
        ]}
        onPress={toggleFavorite}
      >
        <Text style={styles.buttonText}>
          {isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.reviewsTitle, isDarkMode && { color: '#fff' }]}>Kullanıcı Yorumları</Text>

      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <View
            key={index}
            style={[
              styles.reviewCard,
              isDarkMode && { backgroundColor: '#1f1f1f' },
            ]}
          >
            <Text style={[styles.reviewAuthor, isDarkMode && { color: '#fff' }]}>
              {review.author_name}
            </Text>
            <Text style={[styles.reviewText, isDarkMode && { color: '#aaa' }]}>
              "{review.text}"
            </Text>
          </View>
        ))
      ) : (
        <Text style={[styles.noReviews, isDarkMode && { color: '#888' }]}>Yorum bulunamadı.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: 'Montserrat-Bold',
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
    fontFamily: 'Montserrat-Regular',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 50,
    marginTop: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 15,
    color: '#fff',
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 14,
    fontFamily: 'Montserrat-SemiBold',
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
    fontFamily: 'Montserrat-Medium',
  },
  reviewText: {
    fontSize: 14,
    marginTop: 4,
    fontStyle: 'italic',
    fontFamily: 'Montserrat-Regular',
  },
  noReviews: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Montserrat-Regular',
  },
});

export default RepairDetailScreen;
