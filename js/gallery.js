/**
 * @fileoverview Объект галерея
 */

'use strict';

define([
], function() {

  /**
   * Клавиши управления галереей
   * @enum {number}
   */
  var Keys = {
    'escape': 27,
    'left': 37,
    'right': 39
  };
  /**
   * Регулярное выражение поиска адреса
   * скриншота в хэше адреса
   * @constant {RegExp}
   */
  var HASH_REG_EXP = /#photo\/(\S+)/;

  var previewContainer = document.querySelector('.overlay-gallery-preview');
  var currentNumer = previewContainer.querySelector('.preview-number-current');
  var totalNumber = previewContainer.querySelector('.preview-number-total');

  /**
   * @constructor
   */
  var Gallery = function() {

    /**
     * Элемент самой галереи
     * @type {Element}
     */
    this.element = document.querySelector('.overlay-gallery');

    /**
     * Элемент кнопки закрытия
     * @type {Element}
     * @private
     */
    this._closeButton = this.element.querySelector('.overlay-gallery-close');

    /**
     * Элемент листалки влево
     * @type {Element}
     * @private
     */
    this._leftControl = this.element.querySelector('.overlay-gallery-control-left');

    /**
     * Элемент листалки вправо
     * @type {Element}
     * @private
     */
    this._rightControl = this.element.querySelector('.overlay-gallery-control-right');
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onLeftControlClick = this._onLeftControlClick.bind(this);
    this._onRightControlClick = this._onRightControlClick.bind(this);

    /**
     * Индекс текущей фотографии
     * @type {number|null}
     * @private
     */
    this._currentPhoto = null;
    this._isVisible = false;
    window.addEventListener('hashchange', this._onHashChange.bind(this));
  };

  /**
   * Показать галерею
   * @public
   */
  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');
    //Добавляем обработчики
    this._closeButton.addEventListener('click', this._onCloseClick);
    this._leftControl.addEventListener('click', this._onLeftControlClick);
    this._rightControl.addEventListener('click', this._onRightControlClick);
    document.addEventListener('keydown', this._onDocumentKeyDown);
    this._isVisible = true;
  };

  /**
   * Скрыть галерею
   * @public
   */
  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');
    //Убираем обработчики
    this._closeButton.removeEventListener('click', this._onCloseClick);
    this._leftControl.removeEventListener('click', this._onLeftControlClick);
    this._rightControl.removeEventListener('click', this._onRightControlClick);
    document.removeEventListener('keydown', this._onDocumentKeyDown);
    this._isVisible = false;
  };

  /**
   * Сохранить массив элементов со скриншотами
   * в свойстве photoArray
   * @param {Array.<Element>} photos
   * @public
   */
  Gallery.prototype.setPictures = function(photos) {
    //принимает на вход массив объектов Photo и сохраняет его
    this.photoArray = photos;
  };

  /**
   * Получить индекс фото в массиве по адресу
   * @param {string} src
   * @return {number}
   */
  Gallery.prototype.getIndexBySrc = function(src) {
    return this.photoArray.findIndex(function(item) {
      return item.src === src;
    });
  };

  /**
   * Востановить состояние сайта по хешу
   * @public
   */
  Gallery.prototype.restoreFromHash = function() {
    if ( location.hash !== '' ) {
      this.setCurrentPicture(location.hash.match(HASH_REG_EXP)[1]);
      if (!this._isVisible) {
        this.show();
      }
    } else {
      if (this._isVisible) {
        this.hide();
      }
    }
  };

  /**
   * Обработчик изменения хэша адреса
   * @private
   */
  Gallery.prototype._onHashChange = function() {
    this.restoreFromHash();
  };

  /**
   * Сделать фотографию активной
   * в свойстве photoArray
   * @param {number|string} index
   */
  Gallery.prototype.setCurrentPicture = function(index) {
    // Берем фотографию с переданным индексом из массива фотографий
    // и показываем ее в галерее, обновляя DOM-элемент .overlay-gallery:
    //  - добавляем в конец элемента .overlay-gallery-preview фотографию
    //  - обновляем блоки .preview-number-current и .preview-number-total.
    if (typeof index === 'string') {
      index = this.getIndexBySrc(index);
    }

    if (this._currentPhoto === index || index === -1) {
      return;
    }

    this._currentPhoto = index;

    /**
     * type {Image}
     */
    var image = new Image();
    image.src = this.photoArray[index].src;



    var oldImage = previewContainer.querySelector('img');
    if (oldImage !== null ) {
      previewContainer.removeChild(oldImage);
    }
    previewContainer.appendChild(image);

    currentNumer.textContent = this._currentPhoto + 1;
    totalNumber.textContent = this.photoArray.length;

    //управляем видимостью контролов
    this.setControls();
  };

  /**
   * Управление видимостью контролов
   * перемещения по галерее
   */
  Gallery.prototype.setControls = function() {
    if (this._currentPhoto > 0) {
      this._leftControl.classList.remove('invisible');
    } else {
      this._leftControl.classList.add('invisible');
    }

    if (this._currentPhoto < this.photoArray.length - 1) {
      this._rightControl.classList.remove('invisible');
    } else {
      this._rightControl.classList.add('invisible');
    }
  };

  /**
   * Установка хеша адреса по индексу скриншота
   * @param {number} [index]
   * @private
   */
  Gallery.prototype._setLocationHash = function(index) {
    if (typeof index === 'undefined') {
      location.hash = '';
    } else {
      if (index >= 0 || index < this.photoArray.length) {
        location.hash = 'photo' + '/' + this.photoArray[index].src;
      }
    }
  };

  /**
   * Обработчик закрытия галереи
   * @private
   */
  Gallery.prototype._onCloseClick = function() {
    this._setLocationHash();
  };

  /**
   * Обработчик листания скриншотов влево
   * @private
   */
  Gallery.prototype._onLeftControlClick = function() {
    this._setLocationHash(this._currentPhoto - 1);
  };

  /**
   * Обработчик листания скриншотов вправо
   * @private
   */
  Gallery.prototype._onRightControlClick = function() {
    this._setLocationHash(this._currentPhoto + 1);
  };

  /**
   * Обработчик клавиатуры в галерее
   * @param {Event} event
   * @private
   */
  Gallery.prototype._onDocumentKeyDown = function(event) {
    switch (event.keyCode) {
      case Keys.escape:
        this._onCloseClick();
        break;
      case Keys.right:
        this._onRightControlClick();
        break;
      case Keys.left:
        this._onLeftControlClick();
        break;
    }
  };

  return Gallery;
});
