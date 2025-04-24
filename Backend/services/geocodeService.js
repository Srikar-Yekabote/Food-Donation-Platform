const axios = require('axios');

const getCoordinatesFromAddress = async (address) => {
  const apiKey = process.env.GOOGLE_API_KEY;

  const url = 'https://maps.googleapis.com/maps/api/geocode/json';

  const response = await axios.get(url, {
    params: {
      address,
      key: apiKey,
    },
  });

  if (response.data.status !== 'OK' || !response.data.results.length) {
    throw new Error('No results found from Google Maps');
  }

  const { lat, lng } = response.data.results[0].geometry.location;
  return { lat, lng };
};


const reverseGeocode = async (lat, lng) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = 'https://maps.googleapis.com/maps/api/geocode/json';

  const response = await axios.get(url, {
    params: {
      latlng: `${lat},${lng}`,
      key: apiKey,
    },
  });

  if (response.data.status !== 'OK' || !response.data.results.length) {
    throw new Error('Failed to get address from Google Maps.');
  }

  return response.data.results[0].formatted_address;
};

module.exports = { getCoordinatesFromAddress, reverseGeocode };