'use strict';

define([
], function() {
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
  var docCookies = window.docCookies;
  var formUserNameInput = document.getElementById('review-name');
  // Считываем из cookies имя пользователя
  formUserNameInput.value = docCookies.getItem('user');
  // «Имя пользователя» — обязательное поле
  formUserNameInput.required = true;
  // Поле «Описание» становится обязательным, если поле «Оценка» ниже 3
  var MAX_NOREQUIRED_MARK = 3;
  var DEFAULT_MARK = 3;
  // Элементы формы
  var formElement = formUserNameInput.form;
  var formReviewText = document.getElementById('review-text');
  var formReviewFieldBlock = document.getElementsByClassName('review-fields')[0];
  var formReviewFieldName = document.getElementsByClassName('review-fields-name')[0];
  var formReviewFieldText = document.getElementsByClassName('review-fields-text')[0];
  var formReviewSubmitButton = document.getElementsByClassName('review-submit')[0];

  //Считываем из cookies поледнюю оценку, если ее нет ставим дефолтную
  var reviewMark = docCookies.getItem('mark') || DEFAULT_MARK;
  formElement['review-mark-' + reviewMark].checked = true;

  //«ссылки» исчезают из блока по мере заполнения полей формы.
  //когда все обязательные поля заполнены, блок .review-fields исчезает целиком
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

  //Управление видимостью ревью ссылки на имя пользователя
  function setReviewFieldUserNameVisibility() {
    if (formUserNameInput.value === '') {
      formReviewFieldName.classList.remove('invisible');
    } else {
      formReviewFieldName.classList.add('invisible');
    }
    setReviewBlockVisibility();
  }
  //Управление обязательносью ввода Отзыва
  function setRequirePropertyByMark(mark) {
    if (mark < MAX_NOREQUIRED_MARK) {
      formReviewText.required = true;
    } else {
      formReviewText.required = false;
    }
  }

  //Инициализация ревью блока ссылок и кнопки отправки формы
  setRequirePropertyByMark(reviewMark);
  setReviewFieldTextVisibility();
  setReviewFieldUserNameVisibility();

  //Выбрал событие oninput вместо onchange, иначе нельзя сразу после ввода нажать кнопку
  formReviewText.oninput = function() {
    setReviewFieldTextVisibility();
  };

  formUserNameInput.oninput = function() {
    setReviewFieldUserNameVisibility();
  };

  var formRadioButtonList = document.getElementsByName('review-mark');
  for ( var i = 0; i < formRadioButtonList.length; i++ ) {
    formRadioButtonList[i].onchange = function(event) {
      reviewMark = event.target.value;
      setRequirePropertyByMark(reviewMark);
      //Признак required меняется, необходимо скорректировать ревью метку на тестовое поле
      setReviewFieldTextVisibility();
    };
  }

  // При отправке формы сохраним в cookies последние валидные данные имени пользователя и его оценки
  // Срок жизни cookie — количество дней, прошедшее с моего ближайшего дня рождения
  formElement.onsubmit = function(evt) {
    //Прерываем дефолтное поведения события
    evt.preventDefault();

    var now = new Date();
    // 19 августа
    var birthday = new Date(now.getFullYear(), 7, 19);
    if (now < birthday) {
      // День рождения в этом году еще не наступил
      birthday.setFullYear(now.getFullYear() - 1);
    }
    // Спасибо примеру из кесбукинга за 2 часа дебага
    docCookies.setItem('mark', reviewMark, now - birthday);
    docCookies.setItem('user', formUserNameInput.value, now - birthday);

    formElement.submit();
  };
});
