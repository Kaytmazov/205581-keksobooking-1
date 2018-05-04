'use strict';

(function () {
  var ALERT_CLOSE_TIMER = 5000;
  var template = document.querySelector('template');
  var errorTemplate = template.content.querySelector('.error').cloneNode(true);

  window.error = {
    onRequestError: function (errorTitle, errorText) {

      errorTemplate.querySelector('.error__title').textContent = errorTitle;
      errorTemplate.querySelector('.error__text').textContent = errorText;

      document.body.insertAdjacentElement('afterbegin', errorTemplate);

      var errorAlert = document.querySelector('.error');
      var removeErrorAlert = function () {
        errorAlert.remove();
      };
      setTimeout(removeErrorAlert, ALERT_CLOSE_TIMER);
    }
  };
})();

