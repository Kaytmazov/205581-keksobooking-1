'use strict';

(function () {
  // var MainPin = {
  //   WIDTH: 62,
  //   HEIGHT: 62,
  //   START_X: 570,
  //   START_Y: 375
  // };
  var PIN_MAIN_WIDTH = 62;
  var PIN_MAIN_HEIGHT = 62;
  var PIN_ARROW_HEIGHT = 22;
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var template = document.querySelector('template');
  var pinTemplate = template.content.querySelector('.map__pin');
  var map = document.querySelector('.map');
  var mapPinsContainer = map.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');

  window.pin = {
    // Создаем элемента метки
    makePinElement: function (ad) {
      var pinElement = pinTemplate.cloneNode(true);
      var pinAvatar = pinElement.querySelector('img');

      pinElement.style.left = ad.location.x - PIN_WIDTH / 2 + 'px';
      pinElement.style.top = ad.location.y - PIN_HEIGHT + 'px';
      pinAvatar.src = ad.author.avatar;
      pinAvatar.alt = ad.offer.title;

      pinElement.addEventListener('click', function () {
        if (map.querySelector('.map__card')) {
          window.map.closeCard();
        }
        window.map.openCard(ad);
        pinElement.classList.add('map__pin--active');
      });

      return pinElement;
    },

    // Функция вычисления координат главной метки
    calculateMainPinCoords: function (pinState) {
      var cordX = mapPinMain.offsetLeft + (PIN_MAIN_WIDTH / 2);
      var cordY = mapPinMain.offsetTop + (PIN_MAIN_HEIGHT / 2);

      if (pinState === 'dragged') {
        cordY = mapPinMain.offsetTop + PIN_MAIN_HEIGHT + PIN_ARROW_HEIGHT;
      }

      return cordX + ', ' + cordY;
    },
    // Функция отрисовки меток объявлений
    renderPins: function (adsArray) {
      var fragment = document.createDocumentFragment();
      // for (var i = 0; i < adsArray.length; i++) {
      //   fragment.appendChild(window.pin.makePinElement(adsArray[i]));
      // }

      adsArray.forEach(function (it) {
        fragment.appendChild(window.pin.makePinElement(it));
      });

      return fragment;
    },
    // Функция удаления отрисованных меток
    removePins: function () {
      var pins = mapPinsContainer.querySelectorAll('.map__pin:not(.map__pin--main)');
      pins.forEach(function (pin) {
        pin.remove();
      });
    }
  };
})();
