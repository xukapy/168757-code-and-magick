/**
 * @fileoverview Управление отзывами на странице
 */

'use strict';

define([
  'review'
], function(Review) {
  /**
   * Массив отзывов, загруженных по AJAX
   * @type {Array.<Object>}
   */
  var reviews = [];

  /**
   * Отфильтрованный и упорядочнный массив отзывов
   * @type {Array.<Object>}
   */
  var filteredReviews = [];

  /**
   * Последняя отображенная страница отзывов
   * @type {number}
   */
  var currentPage = 0;

  /**
   * Количество отзывов на страницу
   * @constant {number}
   */
  var PAGE_SIZE = 3;

  /**
   * Блок с фильтрами
   * type {Element}
   */
  var formReviewFilter = document.querySelector('form.reviews-filter');
  formReviewFilter.classList.add('invisible');

  formReviewFilter.addEventListener('change', function(event) {
    var clickedElement = event.target;
    if (clickedElement.name === 'reviews') {
      setActiveFilter(clickedElement.id);
    }
  });

  /**
   * Кнопка Показать еще
   * @type {Element}
   */
  var buttonShowMore = document.querySelector('span.reviews-controls-more');
  buttonShowMore.addEventListener('click', function() {
    //Если кнопку удалось нажать значит отзывы еще были
    renderReviews(filteredReviews, ++currentPage);
  });
  //Пока длится загрузка файла, покажите прелоадер, добавив класс .reviews-list-loading блоку .reviews
  var reviewsSection = document.querySelector('section.reviews');
  reviewsSection.classList.add('reviews-list-loading');

  /**
   * Основной контейнер в разметке,
   * где лежат все отзывы
   * @type {Element}
   */
  var container = document.querySelector('div.reviews-list');

  getReviews();

  /**
   * Отрисовка списка отзывов
   * @param {Array.<Object>} reviewsToRender
   * @param {number} pageNumber
   * @param {boolean} [clearContainer]
   */
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

    /**
     * Вспомогательный контейнер, куда мы добавляем отзывы,
     * чтобы затем в один прием добавить их в разметку
     * @type {DocumentFragment}
     */
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

  /**
   * Загрузка данных по отзывам из файла //o0.github.io/assets/json/reviews.json по XMLHttpRequest
   */
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

  /**
   * Установка выбранного фильтра
   * @param {string} id
   */
  function setActiveFilter(id) {
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

});

