'use strict';

(function () {
  var DISABLE_FORM_FIELDS = true;

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
    onRoomNumberFieldChange: function () {
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
    },
    // Поля Тип жилья и цена
    setPriceFieldValue: function () {
      var typeSelectedValue = typeField.options[typeField.selectedIndex].value;

      priceField.placeholder = window.data.AdTypePrices[typeSelectedValue];
      priceField.min = window.data.AdTypePrices[typeSelectedValue];
    }
  };

  window.form.setAddressFieldValue();
  window.form.changeAdFormFieldsState(DISABLE_FORM_FIELDS);

  // Сбрасывает форму при клике на кнопку Очистить
  resetButton.addEventListener('click', function () {
    adForm.reset();
    window.map.disablePageState();
  });

  submitButton.addEventListener('click', function () {
    var capacitySelectedOption = capacityField.options[capacityField.selectedIndex];
    if (capacitySelectedOption.disabled) {
      capacityField.setCustomValidity('Выберите допустимое количество гостей');
    } else {
      capacityField.setCustomValidity('');
    }
  });
})();
