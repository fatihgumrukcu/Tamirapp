import axios from 'axios';

const GOOGLE_API_KEY = 'AIzaSyAhX_qab75bK7JSEhHxnTHh9E32jpoO9YI';

export const getNearbyPlaces = async (latitude: number, longitude: number) => {
  const radius = 3000;
  const type = 'car_repair';
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&keyword=motosiklet%20tamircisi&key=${GOOGLE_API_KEY}`;

  try {
    const response = await axios.get(url);
    console.log('📦 Google API Cevabı:', JSON.stringify(response.data, null, 2));
    return response.data.results;
  } catch (error) {
    console.error('❌ Yerler alınamadı:', error);
    return [];
  }
};
