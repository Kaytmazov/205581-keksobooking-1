'use strict';

(function () {
  var ADS_COUNT = 8;

  var AD_TITLES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];

  var AD_TYPE = [
    'palace',
    'flat',
    'house',
    'bungalo'
  ];

  var TIMES = [
    '12:00',
    '13:00',
    '14:00'
  ];

  var AD_FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];

  var AD_PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  var LOCATION_X_MIN = 300;
  var LOCATION_X_MAX = 900;
  var LOCATION_Y_MIN = 150;
  var LOCATION_Y_MAX = 500;

  // Функция генерации массива похожих объявлений
  var generateAds = function (adsCount) {
    var adsArray = [];

    for (var i = 0; i < adsCount; i++) {
      var locationX = window.util.getRandomInt(LOCATION_X_MIN, LOCATION_X_MAX);
      var locationY = window.util.getRandomInt(LOCATION_Y_MIN, LOCATION_Y_MAX);
      var rooms = window.util.getRandomInt(1, 5);

      adsArray[i] = {
        author: {
          avatar: 'img/avatars/user0' + (i + 1) + '.png'
        },
        offer: {
          title: window.util.getRandomItemFromArray(AD_TITLES),
          address: locationX + ', ' + locationY,
          price: window.util.getRandomInt(1000, 1000000),
          type: window.util.getRandomItemFromArray(AD_TYPE),
          rooms: rooms,
          guests: window.util.getRandomInt(1, 3) * rooms,
          checkin: window.util.getRandomItemFromArray(TIMES),
          checkout: window.util.getRandomItemFromArray(TIMES),
          features: window.util.getRandomLengthArray(AD_FEATURES),
          description: '',
          photos: window.util.shuffleArray(AD_PHOTOS)
        },
        location: {
          x: locationX,
          y: locationY
        }
      };
    }

    return adsArray;
  };

  window.data = {
    AdTypeTranslate: {
      palace: 'Дворец',
      flat: 'Квартира',
      house: 'Дом',
      bungalo: 'Бунгало'
    },
    AdTypePrices: {
      palace: 10000,
      flat: 1000,
      house: 5000,
      bungalo: 0
    },
    ads: generateAds(ADS_COUNT)
  };
})();
