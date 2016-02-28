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

  var gallery = new Gallery();

  var images = document.querySelectorAll('.photogallery-image');
  [].forEach.call(images, function(photo) {
    imageArray[imageArray.length] = photo;
  });

  photoArray = imageArray.map(function(image, index) {
    var photoObject = new Photo();
    photoObject.setData(image);

    photoObject.onClick = function() {
      gallery.setCurrentPicture(index);
      gallery.show();
    };

    return photoObject;
  });

  gallery.setPictures(photoArray);

});
