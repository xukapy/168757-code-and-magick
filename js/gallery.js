'use strict';

(function() {

  var keys = {
    'escape': 27,
    'left': 37,
    'right': 39
  };

  var Gallery = function() {
    this.element = document.querySelector('.overlay-gallery');
    this._closeButton = this.element.querySelector('.overlay-gallery-close');
    this._leftControl = this.element.querySelector('.overlay-gallery-control-left');
    this._rightControl = this.element.querySelector('.overlay-gallery-control-right');
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onLeftControlClick = this._onLeftControlClick.bind(this);
    this._onRightControlClick = this._onRightControlClick.bind(this);
    this._currentPhoto = null;
  };

  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');

    this._closeButton.addEventListener('click', this._onCloseClick);
    this._leftControl.addEventListener('click', this._onLeftControlClick);
    this._rightControl.addEventListener('click', this._onRightControlClick);
    document.addEventListener('keydown', this._onDocumentKeyDown);
  };

  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');

    this._closeButton.removeEventListener('click', this._onCloseClick);
    this._leftControl.removeEventListener('click', this._onLeftControlClick);
    this._rightControl.removeEventListener('click', this._onRightControlClick);
    document.removeEventListener('keydown', this._onDocumentKeyDown);
  };

  Gallery.prototype.setPictures = function(photos) {
    //принимает на вход массив объектов Photo и сохраняет его
    this.photoArray = photos;
  };

  Gallery.prototype.setCurrentPicture = function(index) {
    //берет фотографию с переданным индексом из массива фотографий и отрисовывает показывает ее в галерее
    // , обновляя DOM-элемент .overlay-gallery: добавляет в конец элемента .overlay-gallery-preview фотографию
    // и обновляет блоки .preview-number-current и .preview-number-total.
    if (this._currentPhoto === index) {
      return;
    }

    this._currentPhoto = index;
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

  Gallery.prototype._onDocumentKeyDown = function(event) {

    switch (event.keyCode) {
      case keys.escape:
        this.hide();
        break;

      case keys.right:
        this._onRightControlClick();
        break;

      case keys.left:
        this._onLeftControlClick();
        break;
    }
  };

  window.Gallery = Gallery;
})();
