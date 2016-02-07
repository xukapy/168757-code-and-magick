'use strict';

(function() {
  // div с формой отзыва
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

  //«Имя пользователя» — обязательное поле
  var formUserNameInput = document.getElementById('review-name');
  formUserNameInput.required = true;
  //Поле «Описание» становится обязательным, если поле «Оценка» ниже 3
  var MAX_NOREQUIRED_MARK = 3;
  var formReviewText = document.getElementById('review-text');
  var formRadioButtonList = document.getElementsByName('review-mark');

  for ( var i = 0; i < formRadioButtonList.length; i++ ) {
    formRadioButtonList[i].onchange = function(event) {
      //console.log(event.target.value);
      if (event.target.value < MAX_NOREQUIRED_MARK) {
        formReviewText.required = true;
      } else {
        formReviewText.required = false;
      }
      //Признак required меняется, необходимо скорректировать ревью метку на тестовое поле
      setReviewFieldTextVisibility();
    };
  }
  //«Ссылки» исчезают из блока по мере заполнения полей формы.
  var formReviewFieldBlock = document.getElementsByClassName('review-fields')[0];
  var formReviewFieldName = document.getElementsByClassName('review-fields-name')[0];
  var formReviewFieldText = document.getElementsByClassName('review-fields-text')[0];
  var formReviewSubmitButton = document.getElementsByClassName('review-submit')[0];
  //По умолчанию выбрана оценка 3 с необязательным заполнением текстового поля
  formReviewFieldText.classList.add('invisible');
  //По умолчанию имя обязательно для заполнения и кнопка должна быть выкл
  formReviewSubmitButton.disabled = true;
  //Функция все обязательные поля заполнены, блок .review-fields исчезает целиком
  function setReviewBlockVisibility() {
    if (formReviewFieldName.classList.contains('invisible') && formReviewFieldText.classList.contains('invisible')) {
      formReviewFieldBlock.classList.add('invisible');
      formReviewSubmitButton.disabled = false;
    } else {
      formReviewFieldBlock.classList.remove('invisible');
      formReviewSubmitButton.disabled = true;
    }
  }
  //Управление видимостью ревью ссылки на тестовое поле
  function setReviewFieldTextVisibility() {
    if (formReviewText.value === '' && formReviewText.required ) {
      formReviewFieldText.classList.remove('invisible');
    } else {
      formReviewFieldText.classList.add('invisible');
    }
    setReviewBlockVisibility();
  }
  //Выбрал событие oninput вместо onchange, иначе нельзя сразу после ввода нажать кнопку
  formReviewText.oninput = function() {
    setReviewFieldTextVisibility();
  };

  formUserNameInput.oninput = function() {
    if (formUserNameInput.value === '') {
      formReviewFieldName.classList.remove('invisible');
    } else {
      formReviewFieldName.classList.add('invisible');
    }
    setReviewBlockVisibility();
  };
})();
