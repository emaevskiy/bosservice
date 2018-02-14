
// Отправка форм

$('form').find('button[type=submit]').click(function(){

  event.preventDefault();

  // Валидация полей формы

  form = $(this).closest('form');

  form.find('input, textarea, select').each(function(){

    let warningBox  = '.feedback-warning'; // Тут указываем класс блока, в котором будут отображаться ошибки для неправильно заполненных полей
        inputType   = $(this).attr('name'); // Определяем тип данных поля по атрибуту name
        inputValue  = $(this).val();
        inputReq    = $(this).attr('required'); // Определяем обязательно ли поле для заполнения

    switch(inputType) {

      case 'name': // проверка имени

        var namePattern = /^[a-zA-Zа-яА-Я\s]+$/; // Регулярное выражение для имени

        if (inputValue == '' && inputReq != 'required')
        $(this).removeClass('error  success').next(warningBox).hide().text('')
        else if (inputValue.length >= 2 && namePattern.test(inputValue)) $(this).removeClass('error').addClass('success').next(warningBox).hide().text('success')
        else if (inputReq == 'required' && inputValue == '') $(this).removeClass('success').addClass('error').next(warningBox).show().text('Это поле нужно заполнить')
        else $(this).removeClass('success').addClass('error').next(warningBox).show().text('Введите корректное имя');

      break;

      case 'email': // проверка E-mail

        var emailPattern = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/; // Регулярное выражение для E-mail

        if (inputValue == '' && inputReq != 'required') $(this).removeClass('error  success').next(warningBox).hide().text('')
        else if (inputValue.length >= 8 && emailPattern.test(inputValue)) $(this).removeClass('error').addClass('success').next(warningBox).hide().text('success')
        else if (inputReq == 'required' && inputValue == '') $(this).removeClass('success').addClass('error').next(warningBox).show().text('Это поле нужно заполнить')
        else $(this).removeClass('success').addClass('error').next(warningBox).show().text('Введите корректный E-mail')

      break;

      case 'phone': // проверка телефона

        var phonePattern = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/; // Регулярное выражение для телефона

        if (inputValue == '' && inputReq != 'required') $(this).removeClass('error  success').next(warningBox).hide().text('')
        else if (inputValue.length >= 11 && phonePattern.test(inputValue)) $(this).removeClass('error').addClass('success').next(warningBox).hide().text('success')
        else if (inputReq == 'required' && inputValue == '') $(this).removeClass('success').addClass('error').next(warningBox).show().text('Это поле нужно заполнить')
        else $(this).removeClass('success').addClass('error').next(warningBox).show().text('Введите корректный номер телефона')

      break;

      case 'message': // проверка сообщения

        if (inputValue == '' && inputReq != 'required') $(this).removeClass('error  success').next(warningBox).hide().text('')
        else if (inputValue.length >= 3 && inputValue.length <= 5000) $(this).removeClass('error').addClass('success').next(warningBox).hide().text('success')
        else if (inputReq == 'required' && inputValue == '') $(this).removeClass('success').addClass('error').next(warningBox).show().text('Это поле нужно заполнить')
        else if (inputValue.length > 5000) $(this).removeClass('success').addClass('error').next(warningBox).show().text('Cлишком длинное сообщение')
        else $(this).removeClass('success').addClass('error').next(warningBox).show().text('Cлишком короткое сообщение')

      break;

      case 'select': // проверка выпадающего списка

        if (inputValue == '' && inputReq != 'required') $(this).removeClass('error  success').addClass('success').next(warningBox).hide().text('success')
        else if (inputReq == 'required' && inputValue == '') $(this).removeClass('success').addClass('error').next(warningBox).show().text('Необходимо выбрать элемент из списка')
        else $(this).removeClass('error').addClass('success').next(warningBox).hide().text('success')

      break;

    }

  }); // Конец валидации


  let success  = form.find('.success').length; // количество правильно заполненых полей формы
      error    = form.find('.error').length;   // количество полей заполненых с ошибками

  if (error == 0 && success >= 1) {

    let successMessage  = form.data('success-message');
        data            = form.serialize()

    form.prepend('<div class="loader"><div class="loader-spinner loader-spinner-32"></div></div>'); // Показываем loader во время ожидания ответа от сервера

    $.ajax ({ // Формируем ajax-запрос
      url: 'send.php',
      type: 'POST',
    	data: data,
      success: function(){
        $('.alert').fadeIn(200).css('display', 'flex');
      	$('.alert').find('.alert-message').html(successMessage);
      	disableScroll();
        form.find('.loader').remove();
    	},
      error: function(){
    		console.log('Не удалось выполнить запрос.');
        form.find('.loader').remove();
    	}
    });
  };

});

// Конец


// Галлерея

$('.gallery-item').click(function(){

  let imgPath = $(this).find('.gallery-preview').attr('src');
  $('.gallery-img').attr('src', imgPath);
  $('.gallery-viewer').fadeIn(400).css('display', 'flex');
  disableScroll();

});


$('.gallery-viewer').click(function(){

  $(this).fadeOut(400);
  enableScroll();

});

// Конец


// Закрытие алертов и модальных окон

$('.alert').find('.alert-bg, button').click(function(){

  $(this).closest('.alert, .modal').fadeOut(300);
  enableScroll();

});


$('.modal').find('.modal-bg').click(function(){

  $(this).closest('.modal').fadeOut(300);
  enableScroll();

});

// Конец


// Функции управления скроллом

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {32: 1, 33: 1, 34: 1, 35: 1, 36: 1, 37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;
}


function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}


function disableScroll() {
  if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel       = preventDefault; // modern standard
  window.onmousewheel  = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove   = preventDefault; // mobile
  document.onkeydown   = preventDefaultForScrollKeys;
}


function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel  = document.onmousewheel = null;
    window.onwheel       = null;
    window.ontouchmove   = null;
    document.onkeydown   = null;
}

// Конец
