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
    }
  };
})();
