'use strict';

(function() {

  var Gallery = function() {
    this.element = document.querySelector('.overlay-gallery');
    this._closeButton = this.element.querySelector('.overlay-gallery-close');
    this._leftControl = this.element.querySelector('.overlay-gallery-control-left');
    this._rightControl = this.element.querySelector('.overlay-gallery-control-right');
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
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

  Gallery.prototype._onCloseClick = function() {
    this.hide();
  };

  Gallery.prototype._onLeftControlClick = function() {
    console.log('left control has been clicked');
  };

  Gallery.prototype._onRightControlClick = function() {
    console.log('right control has been clicked');
  };

  Gallery.prototype._onDocumentKeyDown = function(event) {
    if (event.keyCode === 27) {
      this.hide();
    }
  };

  window.Gallery = Gallery;
})();
