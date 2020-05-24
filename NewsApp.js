import { CustomHTTP } from './CustomHTTP';

const apiKey = `e3bc560ad2544f679b60dcaa0621cb24`;
const apiURL = `https://cors-anywhere.herokuapp.com/http://newsapi.org/v2`;
const http = new CustomHTTP();

export class NewsApp {
  constructor() {
    this.form = document.querySelector('#news-form');
    this.onGetResponse = this.onGetResponse.bind(this);

    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.loadNews();
    });
  }

  loadNews() {
    const countrySelect = this.form.querySelector('#country');
    const searchInput = this.form.querySelector('#autocomplete-input');
    const country = countrySelect.value;
    const searchText = searchInput.value;

    this.showLoader();
    if (!searchText) {
      this.newsService.topHeadlines(country, this.onGetResponse);
    } else {
      this.newsService.everything(searchText, this.onGetResponse);
    }
  }

  onGetResponse(err, res) {
    this.removeLoader();
    if (err) {
      this.showAlert(err, `error-msg`);
      return;
    }
    if (!res.articles.length) {
      this.showAlert('No matches were found', `error-msg`);
      return;
    }

    this.renderNews(res.articles);
  }

  renderNews(news) {
    const newsContainer = document.querySelector('.news-container .row');
    if (newsContainer.children.length) {
      this.clearContainer(newsContainer);
    }
    let fragment = ``;

    news.forEach(newsItem => {
      const el = this.getTemplate(newsItem);
      fragment += el;
    });

    newsContainer.insertAdjacentHTML(`afterbegin`, fragment);
  }

  clearContainer(container) {
    let child = container.lastElementChild;
    while (child) {
      container.removeChild(child);
      child = container.lastElementChild;
    }
  }

  getTemplate({ urlToImage, title, url, description }) {
    return `<div class="col s12">
    <div class="card">
      <div class="card-image">
        <img src="${urlToImage}">
        <span class="card-title">${title || ``}</span>
      </div>
     <div class="card-content">
        <p>${description || ``}</p>
     </div>
      <div class="card-action">
        <a href="${url}">Read more</a>
      </div>
    </div>
  </div>
  `;
  }

  showAlert(msg, type = `success`) {
    M.toast({ html: msg, classes: type });
  }

  showLoader() {
    document.body.insertAdjacentHTML(
      `afterbegin`,
      `<div class="progress">
      <div class="indeterminate"></div>
    </div>
  `
    );
  }

  removeLoader() {
    const loader = document.querySelector('.progress');
    loader && loader.remove();
  }
}

NewsApp.prototype.newsService = (function () {
  return {
    topHeadlines(country, cb) {
      http.get(
        `${apiURL}/top-headlines?country=${country}&category=business&apiKey=${apiKey}`,
        cb
      );
    },

    // TODO: add category
    everything(query, cb) {
      http.get(`${apiURL}/everything?q=${query}&apiKey=${apiKey}`, cb);
    }
  };
})();
