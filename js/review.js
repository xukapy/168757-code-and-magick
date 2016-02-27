'use strict';

define([
], function() {

  var starsClassName = [
    'review-rating',
    'review-rating',
    'review-rating-two',
    'review-rating-three',
    'review-rating-four',
    'review-rating-five'
  ];

  function Review(data) {
    this._data = data;
  }

  Review.prototype.render = function() {
    var TIMEOUT = 10000;
    var IMG_WIDTH = 124;
    var IMG_HEIGHT = 124;
    var template = document.querySelector('#review-template');

    this.element = template.content.children[0].cloneNode(true);
    var imgElement = this.element.querySelector('img.review-author');
    //Наполняем данными
    this.element.querySelector('p.review-text').textContent = this._data.description;
    this.element.querySelector('span.review-rating').classList.add(starsClassName[this._data.rating]);

    //Все изображения создаёт с помощью new Image() и добавляет им обработчики загрузки и ошибки
    var avatarImage = new Image(IMG_WIDTH, IMG_HEIGHT);
    avatarImage.src = this._data.author.picture;
    avatarImage.title = this._data.author.name;
    avatarImage.classList.add('review-author');

    var timer = setTimeout(function() {
      avatarImage.src = ''; //Прекращаем загрузку
      this.element.classList.add('review-load-failure'); //Обработчик ошибки
    }.bind(this), TIMEOUT);

    avatarImage.onerror = function() {
      this.element.classList.add('review-load-failure'); //Обработчик ошибки
    }.bind(this);

    avatarImage.onload = function() {
      clearTimeout(timer);
      this.element.replaceChild(avatarImage, imgElement);
    }.bind(this);

  };

  return Review;

});
