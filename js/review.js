/**
 * @fileoverview Объект отзыв
 */


'use strict';

define([
], function() {

  /**
   * Массив соотсветствий оценки отзыва DOM-классу элемента.
   * @type {Array.<string>}
   */
  var starsClassName = [
    'review-rating',
    'review-rating',
    'review-rating-two',
    'review-rating-three',
    'review-rating-four',
    'review-rating-five'
  ];

  /**
   * @param {Object} data
   * @constructor
   */
  function Review(data) {
    /**
     * Отзыв загруженный по AJAX в виде объекта JSON
     * @type {Object}
     * @private
     */
    this._data = data;
  }

  /**
   * Метод отрисовки отзыва.
   * По факту метод ничего не рисует,
   * а на основе шаблона создает ноду,
   * заполняет ее данными из св-ва _data
   * и присваевает его свойству element
   */
  Review.prototype.render = function() {
    /**
     * Таймаут ожидания загрузки аватара пользователя в мс
     * @constant {number}
     */
    var TIMEOUT = 10000;

    /**
     * Ширина картинки аватара
     * @constant {number}
     */
    var IMG_WIDTH = 124;

    /**
     * Высота картинки аватара
     * @constant {number}
     */
    var IMG_HEIGHT = 124;

    /**
     * Шаблон отзыва в разметке
     * @type {Element}
     */
    var template = document.querySelector('#review-template');

    /**
     * Элемент разметки соответсвующий объекту
     * храним прямо в свойстве объекта
     * @type {Element}
     */
    this.element = template.content.children[0].cloneNode(true);

    /**
     * Дефолтная картинка аватара критика
     * @type {Image}
     */
    var imgElement = this.element.querySelector('img.review-author');
    //Наполняем данными
    this.element.querySelector('p.review-text').textContent = this._data.description;
    this.element.querySelector('span.review-rating').classList.add(starsClassName[this._data.rating]);

    /**
     * Загруженная картинка аватара критика
     * @type {Image}
     */
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
