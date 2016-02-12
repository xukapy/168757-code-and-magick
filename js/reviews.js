'use strict';

/* global reviews */

(function() {

  //Прячет блок с фильтрами .reviews-filter, добавляя ему класс invisible.
  var formReviewFilter = document.querySelector('form.reviews-filter');
  formReviewFilter.classList.add('invisible');

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

  //Выводит созданные элементы на страницу внутрь блока .reviews-list.
  var divReviewList = document.querySelector('div.reviews-list');

  reviews.forEach(function(review) {
    var element = getElementFromTemplate(review);
    divReviewList.appendChild(element);
  });

  formReviewFilter.classList.remove('invisible');

})();

