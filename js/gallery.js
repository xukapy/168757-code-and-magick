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
  };

  /**
   * Показать галерею
   */
  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');
    //Добавляем обработчики
    this._closeButton.addEventListener('click', this._onCloseClick);
    this._leftControl.addEventListener('click', this._onLeftControlClick);
    this._rightControl.addEventListener('click', this._onRightControlClick);
    document.addEventListener('keydown', this._onDocumentKeyDown);
  };

  /**
   * Скрыть галерею
   */
  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');
    //Убираем обработчики
    this._closeButton.removeEventListener('click', this._onCloseClick);
    this._leftControl.removeEventListener('click', this._onLeftControlClick);
    this._rightControl.removeEventListener('click', this._onRightControlClick);
    document.removeEventListener('keydown', this._onDocumentKeyDown);
  };

  /**
   * Сохранить массив элементов со скриншотами
   * в свойстве photoArray
   * @param {Array.<Element>} photos
   */
  Gallery.prototype.setPictures = function(photos) {
    //принимает на вход массив объектов Photo и сохраняет его
    this.photoArray = photos;
  };

  /**
   * Сделать фотографию активной
   * в свойстве photoArray
   * @param {number} index
   */
  Gallery.prototype.setCurrentPicture = function(index) {
    // Берем фотографию с переданным индексом из массива фотографий
    // и показываем ее в галерее, обновляя DOM-элемент .overlay-gallery:
    //  - добавляем в конец элемента .overlay-gallery-preview фотографию
    //  - обновляем блоки .preview-number-current и .preview-number-total.
    if (this._currentPhoto === index) {
      return;
    }

    this._currentPhoto = index;
    /**
     * type {Image}
     */
    var image = new Image();
    image.src = this.photoArray[index].src;

    var previewContainer = this.element.querySelector('.overlay-gallery-preview');

    var oldImage = previewContainer.querySelector('img');
    if (oldImage !== null ) {
      previewContainer.removeChild(oldImage);
    }

    previewContainer.appendChild(image);

    //обновляет блоки .preview-number-current и .preview-number-total
    previewContainer.querySelector('.preview-number-current').textContent = this._currentPhoto + 1;
    previewContainer.querySelector('.preview-number-total').textContent = this.photoArray.length;

    //упавляем видимостью контролов
    this.setControls();
  };

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

  Gallery.prototype._onCloseClick = function() {
    this.hide();
  };

  Gallery.prototype._onLeftControlClick = function() {

    if (this._currentPhoto > 0) {
      this.setCurrentPicture(this._currentPhoto - 1);
    }
  };

  Gallery.prototype._onRightControlClick = function() {

    if (this._currentPhoto < this.photoArray.length - 1 ) {
      this.setCurrentPicture(this._currentPhoto + 1);
    }
  };

  /**
   * @param {Event} event
   */
  Gallery.prototype._onDocumentKeyDown = function(event) {
    switch (event.keyCode) {
      case Keys.escape:
        this.hide();
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
