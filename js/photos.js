/**
 * @fileoverview Управление фотографиями в галереи
 */

'use strict';

define([
  'photo',
  'gallery'
], function(Photo, Gallery) {
  /**
   * Массив элеметов со скриншотами
   * @type {Array.<Element>}
   */
  var imageArray = [];

  /**
   * Массив объектов фото
   * @type {Array.<Photo>}
   */
  var photoArray = [];

  /**
   * Коллекция элементов со скриншотами
   * @type {NodeList}
   */
  var images = document.querySelectorAll('.photogallery-image');
  [].forEach.call(images, function(photo) {
    imageArray[imageArray.length] = photo;
  });

  photoArray = imageArray.map(function(image) {
    var photoObject = new Photo();
    photoObject.setData(image);

    photoObject.onClick = function() {
      location.hash = 'photo' + '/' + this.src;
    };

    return photoObject;
  });

  var gallery = new Gallery();
  gallery.setPictures(photoArray);
  gallery.restoreFromHash();

});
