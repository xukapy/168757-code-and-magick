'use strict';

(function() {
  var reviews;
  var filteredReviews = [];
  var currentPage = 0;
  var PAGE_SIZE = 3;
  //Прячет блок с фильтрами .reviews-filter, добавляя ему класс invisible.
  var formReviewFilter = document.querySelector('form.reviews-filter');
  formReviewFilter.classList.add('invisible');
  // Кнопка Показать еще
  var buttonShowMore = document.querySelector('span.reviews-controls-more');
  buttonShowMore.addEventListener('click', function() {
    //Если кнопку удалось нажать значит отзывы еще были
    renderReviews(filteredReviews, ++currentPage);
  });
  //Пока длится загрузка файла, покажите прелоадер, добавив класс .reviews-list-loading блоку .reviews
  var reviewsSection = document.querySelector('section.reviews');
  reviewsSection.classList.add('reviews-list-loading');

  //Фильтры с делегированием
  formReviewFilter.addEventListener('change', function(event) {
    var clickedElement = event.target;
    if (clickedElement.name === 'reviews') {
      setActiveFilter(clickedElement.id);
    }
  });

  var container = document.querySelector('div.reviews-list');

  var starsClassName = [
    'review-rating',
    'review-rating',
    'review-rating-two',
    'review-rating-three',
    'review-rating-four',
    'review-rating-five'
  ];

  //Создаёт для каждой записи массива reviews блок отзыва на основе шаблона #review-template
  function getElementFromTemplate(data) {
    var TIMEOUT = 10000;
    var IMG_WIDTH = 124;
    var IMG_HEIGHT = 124;
    var template = document.querySelector('#review-template');
    var element = template.content.children[0].cloneNode(true);
    var imgElement = element.querySelector('img.review-author');
    //Наполняем данными
    element.querySelector('p.review-text').textContent = data.description;
    element.querySelector('span.review-rating').classList.add(starsClassName[data.rating]);

    //Все изображения создаёт с помощью new Image() и добавляет им обработчики загрузки и ошибки
    var avatarImage = new Image(IMG_WIDTH, IMG_HEIGHT);
    avatarImage.src = data.author.picture;
    avatarImage.title = data.author.name;
    avatarImage.classList.add('review-author');
    var timer = setTimeout(function() {
      avatarImage.src = ''; //Прекращаем загрузку
      element.classList.add('review-load-failure'); //Обработчик ошибки
    }, TIMEOUT);

    avatarImage.onerror = function() {
      element.classList.add('review-load-failure'); //Обработчик ошибки
    };

    avatarImage.onload = function() {
      clearTimeout(timer);
      element.replaceChild(avatarImage, imgElement);
    };

    return element;
  }

  getReviews();

  function renderReviews(reviewsToRender, pageNumber, clearContainer) {
    if (clearContainer) {
      container.innerHTML = '';
    }
    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var pageReviews = reviewsToRender.slice(from, to);

    var fragment = document.createDocumentFragment();

    pageReviews.forEach(function(review) {
      var element = getElementFromTemplate(review);
      fragment.appendChild(element);
    });

    container.appendChild(fragment);
    //Если отзывов больше нет прячем кнопку "Еще отзывы"
    if ((currentPage + 1) >= Math.ceil(reviewsToRender.length / PAGE_SIZE)) {
      buttonShowMore.classList.add('invisible');
    } else {
      buttonShowMore.classList.remove('invisible');
    }
  }

  //Загрузите данные из файла //o0.github.io/assets/json/reviews.json по XMLHttpRequest.
  function getReviews() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '//o0.github.io/assets/json/reviews.json');

    xhr.onload = function(event) {
      var rawData = event.target.response;
      reviews = JSON.parse(rawData);
      setActiveFilter('reviews-all');
      //Когда загрузка закончится, уберите прелоадер и покажите список отзывов
      reviewsSection.classList.remove('reviews-list-loading');
    };

    xhr.onerror = function() {
      reviewsSection.classList.add('reviews-load-failure');
    };

    xhr.send();
  }

  function setActiveFilter(id) {
    //console.log(id);
    var RECENT_LIMIT = 14 * 24 * 60 * 60 * 1000; //2 недели
    var GOOD_RATING_LIMIT = 3; //Хорошие — с рейтингом не ниже 3
    filteredReviews = reviews.slice(0);
    switch (id) {
      case 'reviews-all':
        break;
      case 'reviews-recent':
        //за две недели, отсортированных по убыванию даты
        filteredReviews = filteredReviews.filter(function(a) {
          return new Date() - new Date(a.date) < RECENT_LIMIT;
        });
        filteredReviews = filteredReviews.sort(function(a, b) {
          return new Date(b.date) - new Date(a.date);
        });
        break;
      case 'reviews-good':
        filteredReviews = filteredReviews.filter(function(a) {
          return a.rating >= GOOD_RATING_LIMIT;
        });
        filteredReviews = filteredReviews.sort(function(a, b) {
          return b.rating - a.rating;
        });
        break;
      case 'reviews-bad':
        filteredReviews = filteredReviews.filter(function(a) {
          return a.rating < GOOD_RATING_LIMIT;
        });
        filteredReviews = filteredReviews.sort(function(a, b) {
          return a.rating - b.rating;
        });
        break;
      case 'reviews-popular':
        filteredReviews = filteredReviews.sort(function(a, b) {
          return b.review_usefulness - a.review_usefulness;
        });
        break;
      default:
        console.log('Неизвестное значение фильтра ' + id);
        return;
    }
    currentPage = 0;
    renderReviews(filteredReviews, 0, true);

  }

  formReviewFilter.classList.remove('invisible');

})();

