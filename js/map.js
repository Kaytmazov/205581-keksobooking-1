'use strict';

var ADS_COUNT = 8;
var PIN_HEIGHT = 70;

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

var AdTypeTranslate = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

// Получаем случайный элемент из массива
var getRandomItemFromArray = function (array) {
  var randomItem = array[Math.floor(Math.random() * array.length)];
  return randomItem;
};

// Получаем случайное число в заданом промежутке
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Получаем массив случайной длины
var getRandomLengthArray = function (array) {
  return array.slice(0, getRandomInt(1, array.length));
};

// Перемешать массив
var shuffleArray = function (array) {
  var sheffledArray = [];
  var clone = array.slice();

  while (clone.length) {
    var index = Math.floor(Math.random() * clone.length);
    var element = clone.splice(index, 1)[0];
    sheffledArray.push(element);
  }

  return sheffledArray;
};

// Функция удаления дочерных элементов
var removeChilds = function (parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};

// Функция генерации массива похожих объявлений
var generateAds = function (adsCount) {
  var adsArray = [];

  for (var i = 0; i < adsCount; i++) {
    var locationX = getRandomInt(LOCATION_X_MIN, LOCATION_X_MAX);
    var locationY = getRandomInt(LOCATION_Y_MIN, LOCATION_Y_MAX);
    var rooms = getRandomInt(1, 5);

    adsArray[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: getRandomItemFromArray(AD_TITLES),
        address: locationX + ', ' + locationY,
        price: getRandomInt(1000, 1000000),
        type: getRandomItemFromArray(AD_TYPE),
        rooms: rooms,
        guests: getRandomInt(1, 3) * rooms,
        checkin: getRandomItemFromArray(TIMES),
        checkout: getRandomItemFromArray(TIMES),
        features: getRandomLengthArray(AD_FEATURES),
        description: '',
        photos: shuffleArray(AD_PHOTOS)
      },
      location: {
        x: locationX,
        y: locationY
      }
    };
  }

  return adsArray;
};

// Переключаем карту в активное состояние
var map = document.querySelector('.map');
map.classList.remove('map--faded');

var template = document.querySelector('template');
var pinTemplate = template.content.querySelector('.map__pin');
var cardTemplate = template.content.querySelector('.map__card');

// Создаем элемент метки
var makePinElement = function (ad) {
  var pinElement = pinTemplate.cloneNode(true);
  var pinAvatar = pinElement.querySelector('img');

  pinElement.style.left = ad.location.x + 'px';
  pinElement.style.top = ad.location.y - PIN_HEIGHT / 2 + 'px';
  pinAvatar.src = ad.author.avatar;
  pinAvatar.alt = ad.offer.title;

  return pinElement;
};

// Функция отрисовки меток объявлений
var renderPins = function (ads) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < ads.length; i++) {
    fragment.appendChild(makePinElement(ads[i]));
  }

  return fragment;
};

var ads = generateAds(ADS_COUNT);

var mapPins = map.querySelector('.map__pins');
mapPins.appendChild(renderPins(ads));

var makeFeatureElement = function (item) {
  var featureElement = document.createElement('li');
  featureElement.classList.add('popup__feature');
  featureElement.classList.add('popup__feature--' + item);
  return featureElement;
};

var makePhotoElement = function (item) {
  var photoElement = document.createElement('img');
  photoElement.src = item;
  photoElement.width = 45;
  photoElement.height = 40;
  photoElement.classList.add('popup__photo');
  photoElement.alt = 'Фотография жилья';
  return photoElement;
};

var createCollectionFromArray = function (array, renderFunction) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < array.length; i++) {
    fragment.appendChild(renderFunction(array[i]));
  }
  return fragment;
};

// Создаем элемент объявления
var makeCardElement = function (ad) {
  var cardElement = cardTemplate.cloneNode(true);
  var popupFeatures = cardElement.querySelector('.popup__features');
  var popupPhotos = cardElement.querySelector('.popup__photos');

  cardElement.querySelector('.popup__title').textContent = ad.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = ad.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = AdTypeTranslate[ad.offer.type];
  cardElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

  removeChilds(popupFeatures);
  popupFeatures.appendChild(createCollectionFromArray(ad.offer.features, makeFeatureElement));

  cardElement.querySelector('.popup__description').textContent = ad.offer.description;

  removeChilds(popupPhotos);
  popupPhotos.appendChild(createCollectionFromArray(ad.offer.photos, makePhotoElement));

  cardElement.querySelector('.popup__avatar').src = ad.author.avatar;

  return cardElement;
};

// Функция отрисовки объявления
var renderCard = function () {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(makeCardElement(ads[0]));
  return fragment;
};

map.insertBefore(renderCard(), map.querySelector('.map__filters-container'));
