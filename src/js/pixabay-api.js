import axios from 'axios';

export class PixabayAPI {
  API_KEY = '34932716-1619812f60dbb29308a5d69d6';
  BASE_URL = 'https://pixabay.com/api';
  BASE_SEARCH_PARAMETERS = {
    key: this.API_KEY,
    per_page: 40,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  };

  q = null;
  page = 1;

  fetchImg() {
    return axios.get(`${this.BASE_URL}/?`, {
      params: {
        ...this.BASE_SEARCH_PARAMETERS,
        q: this.q,
        page: this.page,
      },
    });
  }
}
