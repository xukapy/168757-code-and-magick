'use strict';

/* global Review: true, Gallery: true */

(function() {
  var reviews;
  var filteredReviews = [];
  var currentPage = 0;
  var PAGE_SIZE = 3;
  var gallery = new Gallery();
  //Обработчик на показ галереи с делегированием
  document.querySelector('.photogallery').addEventListener('click', function(event) {
   // var clickedElement = event.target;
   // if (clickedElement.name === 'reviews') {
   //   setActiveFilter(clickedElement.id);
   // }
    event.preventDefault();
    gallery.show();
  });

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

  getReviews();

  function renderReviews(reviewsToRender, pageNumber, clearContainer) {
    if (clearContainer) {
      var renderedElements = container.querySelectorAll('.review');
      [].forEach.call(renderedElements, function(el) {
        container.removeChild(el);
      });
    }
    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var pageReviews = reviewsToRender.slice(from, to);

    var fragment = document.createDocumentFragment();

    pageReviews.forEach(function(review) {
      //var element = getElementFromTemplate(review);
      var reviewElement = new Review(review);
      reviewElement.render();
      fragment.appendChild(reviewElement.element);
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

