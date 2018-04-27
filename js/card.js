'use strict';

(function () {
  var template = document.querySelector('template');
  var cardTemplate = template.content.querySelector('.map__card');
  var AdTypeTranslate = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
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

  window.card = {
    // Создаем элемент объявления
    makeCardElement: function (ad) {
      var cardElement = cardTemplate.cloneNode(true);
      var popupFeatures = cardElement.querySelector('.popup__features');
      var popupPhotos = cardElement.querySelector('.popup__photos');
      var popupClose = cardElement.querySelector('.popup__close');

      popupClose.addEventListener('click', function () {
        window.map.closeCard();
      });

      cardElement.querySelector('.popup__title').textContent = ad.offer.title;
      cardElement.querySelector('.popup__text--address').textContent = ad.offer.address;
      cardElement.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
      cardElement.querySelector('.popup__type').textContent = AdTypeTranslate[ad.offer.type];
      cardElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
      cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

      window.util.removeChilds(popupFeatures);
      popupFeatures.appendChild(createCollectionFromArray(ad.offer.features, makeFeatureElement));

      cardElement.querySelector('.popup__description').textContent = ad.offer.description;

      window.util.removeChilds(popupPhotos);
      popupPhotos.appendChild(createCollectionFromArray(ad.offer.photos, makePhotoElement));

      cardElement.querySelector('.popup__avatar').src = ad.author.avatar;

      return cardElement;
    }
  };
})();
