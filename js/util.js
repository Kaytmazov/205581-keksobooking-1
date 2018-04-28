'use strict';

(function () {
  window.util = {
    // Функция удаления дочерных элементов
    removeChilds: function (parent) {
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
    },

    // Получаем случайный элемент из массива
    getRandomItemFromArray: function (array) {
      var randomItem = array[Math.floor(Math.random() * array.length)];
      return randomItem;
    },

    // Получаем случайное число в заданом промежутке
    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Получаем массив случайной длины
    getRandomLengthArray: function (array) {
      return array.slice(0, this.getRandomInt(1, array.length));
    },

    // Перемешать массив
    shuffleArray: function (array) {
      var sheffledArray = [];
      var clone = array.slice();

      while (clone.length) {
        var index = Math.floor(Math.random() * clone.length);
        var element = clone.splice(index, 1)[0];
        sheffledArray.push(element);
      }

      return sheffledArray;
    },
    onRequestError: function (errorTitle, errorText) {
      var template = document.querySelector('template');
      var errorTemplate = template.content.querySelector('.error').cloneNode(true);
      errorTemplate.querySelector('.error__title').textContent = errorTitle;
      errorTemplate.querySelector('.error__text').textContent = errorText;

      document.body.insertAdjacentElement('afterbegin', errorTemplate);

      var errorAlert = document.querySelector('.error');
      var removeErrorAlert = function () {
        errorAlert.remove();
      };
      var timerId = setTimeout(removeErrorAlert, 3000);
      errorAlert.addEventListener('mouseover', function () {
        clearTimeout(timerId);
      });
      errorAlert.addEventListener('mouseout', function () {
        setTimeout(removeErrorAlert, 1000);
      });
    }
  };
})();
