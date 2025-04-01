// utils/favorites.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'FAVORITE_PLACES';

export const addToFavorites = async (place: any) => {
  try {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    const favorites = json ? JSON.parse(json) : [];
    const alreadyExists = favorites.some((item: any) => item.place_id === place.place_id);

    if (!alreadyExists) {
      favorites.push(place);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (err) {
    console.log('Favorilere eklenemedi:', err);
  }
};

export const getFavorites = async () => {
  const json = await AsyncStorage.getItem(FAVORITES_KEY);
  return json ? JSON.parse(json) : [];
};

export const isFavorite = async (placeId: string) => {
  const favorites = await getFavorites();
  return favorites.some((item: any) => item.place_id === placeId);
};
