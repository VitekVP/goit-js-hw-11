import { PixabayAPI } from './js/pixabay-api';
import { makeMarkupCardGallery } from './js/markup-gallery';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

let markup = '';
let searchQuery = null;
let arrayFoundData = [];
let simplelightbox = new SimpleLightbox('.gallery-link', {
  captionsData: 'alt',
  captionDelay: 250,
});

hideBtnLoadMore();

const pixabayAPI = new PixabayAPI();

searchFormEl.addEventListener('submit', handleSearchImg);
loadMoreBtnEl.addEventListener('click', handleLoadMoreClick);

async function handleSearchImg(event) {
  event.preventDefault();
  resetPage();
  resetMarkup();
  hideBtnLoadMore();

  searchQuery = event.target.elements.searchQuery.value.trim();
  pixabayAPI.q = searchQuery;

  if (!searchQuery) {
    Notiflix.Notify.warning(`Enter a non-empty string in the search!`);
    return;
  }

  try {
    const { data } = await pixabayAPI.fetchImg();

    arrayFoundData = data.hits;

    if (arrayFoundData.length === 0) {
      Notiflix.Notify.failure(
        `Sorry, there are no images matching your search query. Please try again`
      );
      return;
    }

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images`);
    addMarkup(arrayFoundData);
    simplelightbox.refresh();
    makeSmoothScrollPage();

    if (arrayFoundData.length === pixabayAPI.BASE_SEARCH_PARAMETERS.per_page) {
      showBtnLoadMore();
    }
  } catch (error) {
    console.log(error);
  }
}

async function handleLoadMoreClick() {
  incrementPage();

  try {
    const { data } = await pixabayAPI.fetchImg();

    arrayFoundData = data.hits;

    addMarkup(arrayFoundData);
    simplelightbox.refresh();
    makeSmoothScrollPage();

    if (arrayFoundData.length !== pixabayAPI.BASE_SEARCH_PARAMETERS.per_page) {
      Notiflix.Notify.failure(
        `We're sorry, but you've reached the end of search results`
      );
      hideBtnLoadMore();
      return;
    }
  } catch (error) {
    console.log(error);
  }
}

function makeSmoothScrollPage() {
  const { height: cardHeight } =
    galleryEl.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function resetPage() {
  pixabayAPI.page = 1;
}

function incrementPage() {
  pixabayAPI.page += 1;
}

function hideBtnLoadMore() {
  loadMoreBtnEl.classList.add('is-hidden');
}

function showBtnLoadMore() {
  loadMoreBtnEl.classList.remove('is-hidden');
}

function resetMarkup() {
  galleryEl.innerHTML = '';
}

function addMarkup(arrayFoundData) {
  markup = arrayFoundData.map(el => makeMarkupCardGallery(el)).join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);
}
