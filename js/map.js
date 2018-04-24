'use strict';

(function () {
  var PIN_MAIN_WIDTH = 62;
  var PIN_MAIN_HEIGHT = 62;
  var PIN_MAIN_START_X = 570;
  var PIN_MAIN_START_Y = 375;
  var PIN_ARROW_HEIGHT = 22;
  var LOCATION_X_MIN = 300;
  var LOCATION_X_MAX = 900;
  var LOCATION_Y_MIN = 150;
  var LOCATION_Y_MAX = 500;
  var ESC_KEYCODE = 27;
  var ENABLE_FORM_FIELDS = false;
  var DISABLE_FORM_FIELDS = true;

  var map = document.querySelector('.map');
  var mapPinsContainer = map.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var typeField = adForm.querySelector('#type');
  var timeInField = adForm.querySelector('#timein');
  var timeOutField = adForm.querySelector('#timeout');
  var roomNumberField = adForm.querySelector('#room_number');

  // Функция переключения состояния страницы
  var enablePageState = function () {
    mapPinsContainer.appendChild(renderPins(window.data.ads));
    window.form.setAddressFieldValue('dragged');

    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');

    typeField.addEventListener('change', window.form.onTypeFieldChange);
    timeInField.addEventListener('change', window.form.onTimeInFieldChange);
    timeOutField.addEventListener('change', window.form.onTimeOutFieldChange);
    roomNumberField.addEventListener('change', window.form.onRoomNumberFieldChange);
    window.form.changeAdFormFieldsState(ENABLE_FORM_FIELDS);
  };

  // Закрытие карточки при нажатии кнопки ESC
  var onCardEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      window.map.closeCard();
    }
  };

  // Функция отрисовки объявления
  var renderCard = function (ad) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(window.card.makeCardElement(ad));
    return fragment;
  };

  // Функция отрисовки меток объявлений
  var renderPins = function (adsArray) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < adsArray.length; i++) {
      fragment.appendChild(window.pin.makePinElement(adsArray[i]));
    }

    return fragment;
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
      window.form.setAddressFieldValue('dragged');
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


  window.map = {
    disablePageState: function () {
      map.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');

      mapPinMain.style.left = PIN_MAIN_START_X + 'px';
      mapPinMain.style.top = PIN_MAIN_START_Y + 'px';
      var pins = mapPinsContainer.querySelectorAll('.map__pin:not(.map__pin--main)');
      for (var i = 0; i < pins.length; i++) {
        pins[i].remove();
      }
      map.querySelector('.map__card').remove();
      window.form.changeAdFormFieldsState(DISABLE_FORM_FIELDS);
      window.form.setAddressFieldValue();
      typeField.removeEventListener('change', window.form.onTypeFieldChange);
      window.form.setPriceFieldValue();
      timeInField.removeEventListener('change', window.form.onTimeInFieldChange);
      timeOutField.removeEventListener('change', window.form.onTimeOutFieldChange);
      roomNumberField.removeEventListener('change', window.form.onRoomNumberFieldChange);
    },
    openCard: function (ad) {
      map.insertBefore(renderCard(ad), map.querySelector('.map__filters-container'));
      document.addEventListener('keydown', onCardEscPress);
    },
    closeCard: function () {
      map.querySelector('.map__card').remove();
      var currentPin = map.querySelector('.map__pin--active');
      currentPin.classList.remove('map__pin--active');
      document.removeEventListener('keydown', onCardEscPress);
    }
  };
})();
