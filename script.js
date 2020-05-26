import { NewsApp } from './js/NewsApp';

const newsApp = new NewsApp();

document.addEventListener('DOMContentLoaded', () => {
  M.AutoInit();
  newsApp.loadNews();
});
