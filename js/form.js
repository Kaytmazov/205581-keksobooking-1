'use strict';

(function () {
  var DISABLE_FORM_FIELDS = true;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var AVATAR_DAFAULT_SRC = 'img/muffin-grey.svg';
  var PHOTO_MIDDLE = 0.5;
  var SAVE_URL = 'https://js.dump.academy/keksobooking';
  var MSG_CLOSE_TIMER = 2000;

  var adForm = document.querySelector('.ad-form');
  var avatarField = adForm.querySelector('#avatar');
  var avatarPreview = adForm.querySelector('.ad-form-header__preview img');
  var addressField = adForm.querySelector('#address');
  var typeField = adForm.querySelector('#type');
  var priceField = adForm.querySelector('#price');
  var timeInField = adForm.querySelector('#timein');
  var timeOutField = adForm.querySelector('#timeout');
  var roomNumberField = adForm.querySelector('#room_number');
  var capacityField = adForm.querySelector('#capacity');
  var photosContainer = adForm.querySelector('.ad-form__photo-container');
  var imagesField = photosContainer.querySelector('#images');
  var photoPreview = photosContainer.querySelector('.ad-form__photo');

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

  var FormPhoto = {
    WIDTH: 70,
    HEIGHT: 70
  };

  var onPhotoDragstart = function (dragstartEvt) {
    var draggedItem = null;

    if (dragstartEvt.target.tagName.toLowerCase() === 'img') {
      draggedItem = dragstartEvt.target.parentNode;
      draggedItem.classList.add('ad-form__photo--dragg');
      dragstartEvt.dataTransfer.setData('text/plain', dragstartEvt.target.alt);
    }

    // Фнукция отвечающая за сортировку
    var onDragOver = function (evt) {
      var cell = evt.target.parentNode;
      var rect = cell.getBoundingClientRect();
      var next = (evt.clientX - rect.left) / (rect.right - rect.left) > PHOTO_MIDDLE;

      evt.preventDefault();

      if (cell && cell !== draggedItem && cell.draggable) {
        photosContainer.insertBefore(draggedItem, next && cell.nextSibling || cell);
      }
    };

    // Окончание сортировки
    var onDragEnd = function (evt) {
      evt.preventDefault();

      draggedItem.classList.remove('ad-form__photo--dragg');
      photosContainer.removeEventListener('dragover', onDragOver);
      photosContainer.removeEventListener('dragend', onDragEnd);
    };

    photosContainer.addEventListener('dragover', onDragOver);
    photosContainer.addEventListener('dragend', onDragEnd);
  };

  var onSuccess = function () {
    window.map.disablePageState();
    removeFormPhotos();
    avatarPreview.src = AVATAR_DAFAULT_SRC;
    var successMessage = document.querySelector('.success');
    successMessage.classList.remove('hidden');
    var hideSuccessMsg = function () {
      successMessage.classList.add('hidden');
    };
    setTimeout(hideSuccessMsg, MSG_CLOSE_TIMER);
  };

  var removeFormPhotos = function () {
    var photos = photosContainer.querySelectorAll('.ad-form__photo:not(:last-of-type)');
    photos.forEach(function (it) {
      it.remove();
    });
  };

  // Обновление картинки аватара в форме
  var updateAvatarPreview = function () {
    var file = avatarField.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatarPreview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  // Обновление картинок жилья в форме
  var makePhotoElement = function (src) {
    var photoWrapper = photosContainer.querySelector('.ad-form__photo').cloneNode();
    var photoElement = document.createElement('img');
    photoElement.src = src;
    photoElement.width = FormPhoto.WIDTH;
    photoElement.height = FormPhoto.HEIGHT;
    photoElement.alt = 'Фотография жилья';
    photoWrapper.draggable = true;
    photoWrapper.appendChild(photoElement);
    return photoWrapper;
  };

  var updatePhotosPreview = function () {
    var files = imagesField.files;
    var fragment = document.createDocumentFragment();

    Array.from(files).forEach(function (file) {
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          fragment.appendChild(makePhotoElement(reader.result));
          photosContainer.insertBefore(fragment, photoPreview);
        });

        reader.readAsDataURL(file);
      }
    });
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

  window.form = {
    onAvatarChange: updateAvatarPreview,
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
    onRoomNumberFieldChange: updateCapacityField,
    // Поля Тип жилья и цена
    setPriceFieldValue: function () {
      var typeSelectedValue = typeField.options[typeField.selectedIndex].value;

      priceField.placeholder = typePricesMap[typeSelectedValue];
      priceField.min = typePricesMap[typeSelectedValue];
    },
    onImagesFieldChange: updatePhotosPreview,
    // Перемещение изображений жилья
    onPhotoDragstart: onPhotoDragstart,
    // Сбрасывает форму при клике на кнопку Очистить
    onResetButtonClick: function () {
      window.map.disablePageState();
      avatarPreview.src = AVATAR_DAFAULT_SRC;
      updateCapacityField();
      removeFormPhotos();
    },
    onSubmitButtonClick: function () {
      var capacitySelectedOption = capacityField.options[capacityField.selectedIndex];
      if (capacitySelectedOption.disabled) {
        capacityField.setCustomValidity('Выберите допустимое количество гостей');
      } else {
        capacityField.setCustomValidity('');
      }
    },
    onSubmit: function (evt) {
      window.backend.save(new FormData(adForm), onSuccess, window.error, SAVE_URL);
      evt.preventDefault();
    }
  };

  window.form.setAddressFieldValue();
  window.util.changeFormFieldsState(DISABLE_FORM_FIELDS, adForm);
})();
