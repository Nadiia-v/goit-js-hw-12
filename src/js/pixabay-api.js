import axios from 'axios';

const mainURL = 'https://pixabay.com/api/';
const apiKey = '49590531-00b723f692e526587c18c8f84';

export async function getImagesByQuery(query, page) {
  try {
    const response = await axios.get(mainURL, {
      params: {
        key: apiKey,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: 15,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch data from Pixabay API:', error);
    throw error;
  }
}
