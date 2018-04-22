'use strict';

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

var PIN_MAIN_WIDTH = 62;
var PIN_MAIN_HEIGHT = 62;
var PIN_ARROW_HEIGHT = 22;
var PIN_MAIN_START_X = 570;
var PIN_MAIN_START_Y = 375;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var LOCATION_X_MIN = 300;
var LOCATION_X_MAX = 900;
var LOCATION_Y_MIN = 150;
var LOCATION_Y_MAX = 500;
var ENABLE_FORM_FIELDS = false;
var DISABLE_FORM_FIELDS = true;
var ESC_KEYCODE = 27;

var AdTypeTranslate = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

var AdTypePrices = {
  palace: 10000,
  flat: 1000,
  house: 5000,
  bungalo: 0
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

var map = document.querySelector('.map');
var mapPinsContainer = map.querySelector('.map__pins');
var mapPinMain = document.querySelector('.map__pin--main');
var template = document.querySelector('template');
var pinTemplate = template.content.querySelector('.map__pin');
var cardTemplate = template.content.querySelector('.map__card');
var ads = generateAds(ADS_COUNT);

// Закрытие карточки при нажатии кнопки ESC
var onCardEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeCard();
  }
};

// Закрытие карточки при клике на крестик
var onPopupCloseClick = function () {
  closeCard();
};

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
  var popupClose = cardElement.querySelector('.popup__close');

  popupClose.addEventListener('click', onPopupCloseClick);

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
var renderCard = function (ad) {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(makeCardElement(ad));
  return fragment;
};

var openCard = function (ad) {
  map.insertBefore(renderCard(ad), map.querySelector('.map__filters-container'));
  document.addEventListener('keydown', onCardEscPress);
};

var closeCard = function () {
  map.querySelector('.map__card').remove();
  var currentPin = map.querySelector('.map__pin--active');
  currentPin.classList.remove('map__pin--active');
  document.removeEventListener('keydown', onCardEscPress);
};

// Создаем элемента метки
var makePinElement = function (ad) {
  var pinElement = pinTemplate.cloneNode(true);
  var pinAvatar = pinElement.querySelector('img');

  pinElement.style.left = ad.location.x - PIN_WIDTH / 2 + 'px';
  pinElement.style.top = ad.location.y - PIN_HEIGHT + 'px';
  pinAvatar.src = ad.author.avatar;
  pinAvatar.alt = ad.offer.title;

  pinElement.addEventListener('click', function () {
    if (map.querySelector('.map__card')) {
      closeCard();
    }
    openCard(ad);
    pinElement.classList.add('map__pin--active');
  });

  return pinElement;
};

// Функция отрисовки меток объявлений
var renderPins = function (adsArray) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < adsArray.length; i++) {
    fragment.appendChild(makePinElement(adsArray[i]));
  }

  return fragment;
};

var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var addressField = adForm.querySelector('#address');
var typeField = adForm.querySelector('#type');
var priceField = adForm.querySelector('#price');
var timeInField = adForm.querySelector('#timein');
var timeOutField = adForm.querySelector('#timeout');
var roomNumberField = adForm.querySelector('#room_number');
var capacityField = adForm.querySelector('#capacity');
var resetButton = adForm.querySelector('.ad-form__reset');
var submitButton = adForm.querySelector('.ad-form__submit');

// Функция вычисления координат главной метки
var calculateMainPinCoords = function (pinState) {
  var cordX = mapPinMain.offsetLeft + (PIN_MAIN_WIDTH / 2);
  var cordY = mapPinMain.offsetTop + (PIN_MAIN_HEIGHT / 2);

  if (pinState === 'dragged') {
    cordY = mapPinMain.offsetTop + PIN_MAIN_HEIGHT + PIN_ARROW_HEIGHT;
  }

  return cordX + ', ' + cordY;
};

// Функция установки значения в поле адреса
var setAddressFieldValue = function (pinState) {
  addressField.value = calculateMainPinCoords(pinState);
};
setAddressFieldValue();

// Функция включения / отключения полей формы
var changeAdFormFieldsState = function (value) {
  for (var i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].disabled = value;
  }
};
changeAdFormFieldsState(DISABLE_FORM_FIELDS);

// Поля Тип жилья и цена
var setPriceFieldValue = function () {
  var typeSelectedValue = typeField.options[typeField.selectedIndex].value;

  priceField.placeholder = AdTypePrices[typeSelectedValue];
  priceField.min = AdTypePrices[typeSelectedValue];
};

var onTypeFieldChange = function () {
  setPriceFieldValue();
};

// Поля Время заезда и выезда
var onTimeInFieldChange = function () {
  timeOutField.options.selectedIndex = timeInField.options.selectedIndex;
};

var onTimeOutFieldChange = function () {
  timeInField.options.selectedIndex = timeOutField.options.selectedIndex;
};

// Поля Количество комнат и мест
var onRoomNumberFieldChange = function () {
  var roomSelectedValue = parseInt(roomNumberField.options[roomNumberField.selectedIndex].value, 10);

  switch (roomSelectedValue) {
    case 1:
      capacityField.options[0].disabled = false;
      capacityField.options[1].disabled = true;
      capacityField.options[2].disabled = true;
      capacityField.options[3].disabled = true;
      break;
    case 2:
      capacityField.options[0].disabled = false;
      capacityField.options[1].disabled = false;
      capacityField.options[2].disabled = true;
      capacityField.options[3].disabled = true;
      break;
    case 3:
      capacityField.options[0].disabled = false;
      capacityField.options[1].disabled = false;
      capacityField.options[2].disabled = false;
      capacityField.options[3].disabled = true;
      break;
    default:
      capacityField.options[0].disabled = true;
      capacityField.options[1].disabled = true;
      capacityField.options[2].disabled = true;
      capacityField.options[3].disabled = false;
  }
};

// Функция переключения состояния страницы
var enablePageState = function () {
  mapPinsContainer.appendChild(renderPins(ads));
  setAddressFieldValue('dragged');

  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');

  typeField.addEventListener('change', onTypeFieldChange);
  timeInField.addEventListener('change', onTimeInFieldChange);
  timeOutField.addEventListener('change', onTimeOutFieldChange);
  roomNumberField.addEventListener('change', onRoomNumberFieldChange);
  changeAdFormFieldsState(ENABLE_FORM_FIELDS);
};

var disablePageState = function () {
  map.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');

  mapPinMain.style.left = PIN_MAIN_START_X + 'px';
  mapPinMain.style.top = PIN_MAIN_START_Y + 'px';
  var pins = mapPinsContainer.querySelectorAll('.map__pin:not(.map__pin--main)');
  for (var i = 0; i < pins.length; i++) {
    pins[i].remove();
  }
  map.querySelector('.map__card').remove();
  changeAdFormFieldsState(DISABLE_FORM_FIELDS);
  setAddressFieldValue();
  typeField.removeEventListener('change', onTypeFieldChange);
  setPriceFieldValue();
  timeInField.removeEventListener('change', onTimeInFieldChange);
  timeOutField.removeEventListener('change', onTimeOutFieldChange);
  roomNumberField.removeEventListener('change', onRoomNumberFieldChange);
};

// Активация карты при перемещении метки
var onMainPinDrag = function (evt) {
  evt.preventDefault();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var currentPinX = mapPinMain.offsetLeft - shift.x;
    var currentPinY = mapPinMain.offsetTop - shift.y;

    var isAvialibleX = currentPinX + (PIN_MAIN_WIDTH / 2) > LOCATION_X_MIN && currentPinX + (PIN_MAIN_WIDTH / 2) < LOCATION_X_MAX;
    var isAvialibleY = currentPinY + PIN_MAIN_HEIGHT + PIN_ARROW_HEIGHT > LOCATION_Y_MIN && currentPinY + PIN_MAIN_HEIGHT + PIN_ARROW_HEIGHT < LOCATION_Y_MAX;

    if (isAvialibleX) {
      mapPinMain.style.left = currentPinX + 'px';
    }

    if (isAvialibleY) {
      mapPinMain.style.top = currentPinY + 'px';
    }
    setAddressFieldValue('dragged');
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    enablePageState();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

mapPinMain.addEventListener('mouseup', onMainPinDrag);
mapPinMain.addEventListener('mousedown', onMainPinDrag);

// Сбрасывает форму при клике на кнопку Очистить
resetButton.addEventListener('click', function () {
  adForm.reset();
  disablePageState();
});

submitButton.addEventListener('click', function () {
  var capacitySelectedOption = capacityField.options[capacityField.selectedIndex];
  if (capacitySelectedOption.disabled) {
    capacityField.setCustomValidity('Выберите допустимое количество гостей');
  } else {
    capacityField.setCustomValidity('');
  }
});
