/**
 * @fileoverview Объект фото
 */

'use strict';

define([
], function() {
  /**
   * @constructor
   */
  var Photo = function() {
    this._onClick = this._onClick.bind(this);
  };

  /**
   * Ссылка на скриншот
   * @type {?string}
   */
  Photo.prototype.scr = null;

  /**
   * @param {Element} data
   */
  Photo.prototype.setData = function(data) {
    this.src = data.querySelector('img').getAttribute('src');
    data.addEventListener('click', this._onClick);
  };


  Photo.prototype._onClick = function(evt) {
    // Нужно вызвать коллбэк, который будет переопределен снаружи
    if (typeof this.onClick === 'function') {
      evt.preventDefault();
      this.onClick();
    }
  };

  /**
   * Наполнение функции определяется извне
   * @type {?Function}
   */
  Photo.prototype.onClick = null;

  return Photo;
});
