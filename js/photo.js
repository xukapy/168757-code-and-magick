'use strict';

define([
], function() {

  var Photo = function() {
    this._onClick = this._onClick.bind(this);
  };

  Photo.prototype.scr = null;

  Photo.prototype.setData = function(data) {
    this.src = data.querySelector('img').getAttribute('src');
    data.addEventListener('click', this._onClick);
  };


  Photo.prototype._onClick = function() {
    // Нужно вызвать коллбэк, который будет переопределен снаружи
    if (typeof this.onClick === 'function') {
      this.onClick();
    }
  };

  Photo.prototype.onClick = null;

  return Photo;
});
