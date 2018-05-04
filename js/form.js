'use strict';

(function () {
  var DISABLE_FORM_FIELDS = true;
  var SAVE_URL = 'https://js.dump.academy/keksobooking';

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
  var AdTypePrices = {
    palace: 10000,
    flat: 1000,
    house: 5000,
    bungalo: 0
  };

  var capacityValuesMap = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0'],
  };

  var updateCapacityField = function () {
    var roomSelectedValue = roomNumberField.options[roomNumberField.selectedIndex].value;
    var capacityAllowedValues = capacityValuesMap[roomSelectedValue];

    var capacityAllowedOptions = [];

    for (var i = 0; i < capacityAllowedValues.length; i++) {
      var index = capacityAllowedValues[i];
      for (var j = 0; j < capacityField.options.length; j++) {
        if (capacityField.options[j].value === index) {
          capacityAllowedOptions.push(capacityField.options[j]);
        } else {
          capacityField.options[j].disabled = true;
        }
      }
    }

    for (i = 0; i < capacityAllowedOptions.length; i++) {
      capacityAllowedOptions[i].disabled = false;
    }
  };

  window.form = {
    // Функция установки значения в поле адреса
    setAddressFieldValue: function (pinState) {
      addressField.value = window.pin.calculateMainPinCoords(pinState);
    },
    // Функция включения / отключения полей формы
    changeAdFormFieldsState: function (value) {
      for (var i = 0; i < adFormFieldsets.length; i++) {
        adFormFieldsets[i].disabled = value;
      }
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
    // onRoomNumberFieldChange: function () {
    //   var roomSelectedValue = parseInt(roomNumberField.options[roomNumberField.selectedIndex].value, 10);

    //   switch (roomSelectedValue) {
    //     case 1:
    //       capacityField.options[0].disabled = false;
    //       capacityField.options[1].disabled = true;
    //       capacityField.options[2].disabled = true;
    //       capacityField.options[3].disabled = true;
    //       break;
    //     case 2:
    //       capacityField.options[0].disabled = false;
    //       capacityField.options[1].disabled = false;
    //       capacityField.options[2].disabled = true;
    //       capacityField.options[3].disabled = true;
    //       break;
    //     case 3:
    //       capacityField.options[0].disabled = false;
    //       capacityField.options[1].disabled = false;
    //       capacityField.options[2].disabled = false;
    //       capacityField.options[3].disabled = true;
    //       break;
    //     default:
    //       capacityField.options[0].disabled = true;
    //       capacityField.options[1].disabled = true;
    //       capacityField.options[2].disabled = true;
    //       capacityField.options[3].disabled = false;
    //   }
    // },
    onRoomNumberFieldChange: function () {
      updateCapacityField();
    },
    // Поля Тип жилья и цена
    setPriceFieldValue: function () {
      var typeSelectedValue = typeField.options[typeField.selectedIndex].value;

      priceField.placeholder = AdTypePrices[typeSelectedValue];
      priceField.min = AdTypePrices[typeSelectedValue];
    }
  };

  window.form.setAddressFieldValue();
  window.form.changeAdFormFieldsState(DISABLE_FORM_FIELDS);

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
})();
