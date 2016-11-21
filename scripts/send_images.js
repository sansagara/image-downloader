(function () {
  /* globals chrome */
  'use strict';

  var imageDownloader = {
    imageRegex: /(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:jpe?g|gif|png))(?:\?([^#]*))?(?:#(.*))?/i,
    mapElement: function (element) {
      if (element.tagName.toLowerCase() === 'img') {
        var src = element.src;
        var hashIndex = src.indexOf('#');
        if (hashIndex >= 0) {
          src = src.substr(0, hashIndex);
        }
        return src;
      }
      return '';
    },

    mapElementAltText: function (element) {
      if (element.tagName.toLowerCase() === 'img') {
        return element.alt;
      }
      return '';
    },


    extractURLFromStyle: function (url) {
      return url.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
    },

    isImageURL: function (url) {
      return url.substring(0, 10) === 'data:image' || imageDownloader.imageRegex.test(url);
    },

    removeDuplicateOrEmpty: function (images) {
      var result = [],
          hash = {};

      for (var i = 0; i < images.length; i++) {
        hash[images[i]] = 0;
      }
      for (var key in hash) {
        if (key !== '') {
          result.push(key);
        }
      }
      return result;
    }
  };

  imageDownloader.linkedImages = {};

  imageDownloader.images = [].slice.apply(document.getElementsByTagName('*'));
  imageDownloader.images = imageDownloader.images.map(imageDownloader.mapElement);

  imageDownloader.alt_text = [].slice.apply(document.getElementsByTagName('*'));
  imageDownloader.alt_text = imageDownloader.alt_text.map(imageDownloader.mapElementAltText);

  imageDownloader.images = imageDownloader.removeDuplicateOrEmpty(imageDownloader.images);
  imageDownloader.alt_text = imageDownloader.removeDuplicateOrEmpty(imageDownloader.alt_text);

  chrome.extension.sendMessage({ linkedImages: imageDownloader.linkedImages, images: imageDownloader.images, alt: imageDownloader.alt_text });

  imageDownloader.linkedImages = null;
  imageDownloader.images = null;
}());
