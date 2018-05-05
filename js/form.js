'use strict';

(function () {
  var DISABLE_FORM_FIELDS = true;
  var SAVE_URL = 'https://js.dump.academy/keksobooking';

  var adForm = document.querySelector('.ad-form');
  var addressField = adForm.querySelector('#address');
  var typeField = adForm.querySelector('#type');
  var priceField = adForm.querySelector('#price');
  var timeInField = adForm.querySelector('#timein');
  var timeOutField = adForm.querySelector('#timeout');
  var roomNumberField = adForm.querySelector('#room_number');
  var capacityField = adForm.querySelector('#capacity');
  var resetButton = adForm.querySelector('.ad-form__reset');
  var submitButton = adForm.querySelector('.ad-form__submit');

  var typePricesMap = {
    palace: 10000,
    flat: 1000,
    house: 5000,
    bungalo: 0
  };

  // Словарь соответствия количества мест количуству комнат
  var capacityValuesMap = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0'],
  };

  var updateCapacityField = function () {
    var roomSelectedValue = parseInt(roomNumberField.options[roomNumberField.selectedIndex].value, 10);
    var capacityAllowedValues = capacityValuesMap[roomSelectedValue];

    Array.from(capacityField.options).forEach(function (it) {
      it.disabled = true;

      if (capacityAllowedValues.indexOf(it.value) !== -1) {
        it.disabled = false;
      }
    });
  };

  // Сбрасывает форму при клике на кнопку Очистить
  resetButton.addEventListener('click', function () {
    window.map.disablePageState();
    updateCapacityField();
  });

  submitButton.addEventListener('click', function () {
    var capacitySelectedOption = capacityField.options[capacityField.selectedIndex];
    if (capacitySelectedOption.disabled) {
      capacityField.setCustomValidity('Выберите допустимое количество гостей');
    } else {
      capacityField.setCustomValidity('');
    }
  });

  var onSuccess = function () {
    window.map.disablePageState();
    var successMessage = document.querySelector('.success');
    successMessage.classList.remove('hidden');
    var hideSuccessMsg = function () {
      successMessage.classList.add('hidden');
    };
    setTimeout(hideSuccessMsg, 2000);
  };

  adForm.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(adForm), onSuccess, window.error.onRequestError, SAVE_URL);
    evt.preventDefault();
  });

  window.form = {
    // Функция установки значения в поле адреса
    setAddressFieldValue: function (pinState) {
      addressField.value = window.pin.calculateMainPinCoords(pinState);
    },
    onTypeFieldChange: function () {
      window.form.setPriceFieldValue();
    },
    // Поля Время заезда и выезда
    onTimeInFieldChange: function () {
      timeOutField.options.selectedIndex = timeInField.options.selectedIndex;
    },
    onTimeOutFieldChange: function () {
      timeInField.options.selectedIndex = timeOutField.options.selectedIndex;
    },
    // Поля Количество комнат и мест
    onRoomNumberFieldChange: function () {
      updateCapacityField();
    },
    // Поля Тип жилья и цена
    setPriceFieldValue: function () {
      var typeSelectedValue = typeField.options[typeField.selectedIndex].value;

      priceField.placeholder = typePricesMap[typeSelectedValue];
      priceField.min = typePricesMap[typeSelectedValue];
    }
  };

  window.form.setAddressFieldValue();
  window.util.changeFormFieldsState(DISABLE_FORM_FIELDS, adForm);
})();
