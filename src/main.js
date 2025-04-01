import { getImagesByQuery } from './js/pixabay-api.js';
import {
  renderGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
const loader = document.querySelector('.loader');

hideLoadMoreButton();

let page = 1;
let currentQuery = '';
const perPage = 15;
let totalHits = 0;

form.addEventListener('submit', async event => {
  event.preventDefault();
  const query = event.target.elements.search.value.trim();

  if (!query) {
    iziToast.error({ message: 'Enter your search word!' });
    return;
  }
  currentQuery = query;
  page = 1;

  clearGallery();
  hideLoadMoreButton();

  await fetchImagesAndRender();
});

loadMoreButton.addEventListener('click', async () => {
  page += 1;
  await fetchImagesAndRender(true);
});

async function fetchImagesAndRender(scroll = false) {
  showLoader();
  try {
    const data = await getImagesByQuery(currentQuery, page);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.warning({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }
    renderGallery(data.hits);

    if (scroll) smoothScroll();

    const totalPages = Math.ceil(totalHits / perPage);
    if (page >= totalPages) {
      hideLoadMoreButton();
      iziToast.info({
        message:
          'We are sorry, but you have reached the end of search results.',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      message: 'An error occurred when getting the pictures',
    });
  } finally {
    hideLoader();
  }
}

function smoothScroll() {
  const cardHeight = gallery.firstElementChild.getBoundingClientRect().height;

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
