"use strict";
//AJAX (Asynchronous Javascript and XML) позволяет обновлять часть контента страницы, без полной перезагрузки, экономя траффик
//Создадим конвертер валю где курс будет приходить от сервера по требованию
//разбираем самый первый вариант AJAX который реализуется при помощи объекта XML hhtp request(не актуален, но встречается)
//который встроен в браузер

//в папке JS файл current.json с внутренним текстом (путь js/current.json) 
// {
//     "current": {     //свойство объекта содержит объект usd со свойством 74 - курс доллара
//         "usd": 74    // это значение будет доставать через usd
//     }
// }

//получаем элементы инпутов со страницы. В один rub будет пользователь вводить значение, а во второй usd будем выводить 
//сконвертированное значение на основании запроса от сервера и обработки
const inputRub = document.querySelector("#rub"),
      inputUsd = document.querySelector("#usd"),
      inputHrn = document.querySelector('#hrn');

//назначаем обработчик события для получения данных от пользователя. Выбор между input и change
//change - происходит когда пользователь напечатала что то в поле и увел фокус(табом или клацнул в другое место на странице)
//input - происходит каждый раз когда что то вводится или удаляется в поле
inputRub.addEventListener('input', () => {
    const request = new XMLHttpRequest(); //создаем запрос на сервер

    // этот метод собирает настройки которые позволят в будущем сделать запрос request.open(method, url, async, login, pass); 
    //method - метод для запроса (GET,POST)  пишутся в верхнем регистре, url - путь к серверу(файлу) относительно index.html , 
    //async - по умолчанию true, чтобы остальной код не ждал ответа от сервера,
    // потому что неизвестно как долго это будет, можно поставить в false при надобности
    //login и pass используются для некоторых запросов требующих авторизации
    request.open('GET', 'js/current.json'); // запрос, остальные аргументы для нас сейчас необязательны
    //для уточнения серверу что мы хотим получить используются заголовки Header
    //'Content-type' - тип контента, 'application/json' указываем что хотим json файл с кодировкой utf-8
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    request.send(); // отправляем запрос на сервер
    //если метод post или подобный то send(body) - принимает аргументы для отправки

    //СВОЙСТВА запроса: status - код с которым вернется запрос(200 OK - успешные, 400 - ошибка клиента(404 Not Found) ... и тд)
    //посмотреть состояния можно по запросу  << Список кодов состояния HTTP >>
    //statusText - текстовое описание ответа сервера (ок, Not found, ... и тд)
    //response - ответ от сервера (то что задл бэк енд разработчик), используем его в клиенте
    //readyState - содержит текущее состояние запроса(цыфра). Цыфра 0 значение UNSENT, 1 OPENED, 2 HEADERS_RECEIVED,
    //3	LOADING, 4	DONE (выполнена)

    //СОБЫТИЯ loadstart, progress, abort, timeout, loadend, но чаще всего используются cледующие 2 события
    //рассмотрим реализацию каждого из них

    //readystatechange - отслеживает статус готовности запроса в текущий момент например с 0 на 1 - сработало, с 1-2 сработало
    // request.addEventListener('readystatechange', () => { //
    //     if(request.readyState === 4 && request.status === 200){
    //         console.log(request.response); // получаем объект из json файла который нужно трансформировать в объект JS
    //         const data = JSON.parse(request.response); //получаем объект JS
    //         //рассчитываем курс валют на основании ввода пользователя и ответа сервера и выводим в поле
    //         inputUsd.value = (+inputRub.value / data.current.usd).toFixed(2); //toFixed(2) - округляем до 2х заков после точки
    //     } else { //дописываем елсе если сервер сломался что бы пользователь увидел ошибку
    //         inputUsd.value = 'Что то пошло не так';
    //     }
    // });
    //Используется редко потому что обычно промежуточные стадии 0, 1, 2, 3 не нужны, а нужна сразу 4 DONE (выполнена)

    //load - срабатывает когда запрос полностью загрузился и получен результат. 4 DONE (выполнена) - не значит что выполнен
    //успешно, данные могут потерятся или еще что то
    request.addEventListener('load', () => { // оставляем проверку на успешное выполнение status
        if(request.status === 200){
            const data = JSON.parse(request.response); //получаем объект JS
            //рассчитываем курс валют на основании ввода пользователя и ответа сервера и выводим в поле
            inputUsd.value = (+inputRub.value / data.rub.usd).toFixed(2); //toFixed(2) - округляем до 2х заков после точки
            inputHrn.value = (+inputRub.value / data.rub.hrn).toFixed(2);
        } else { //дописываем елсе если сервер сломался что бы пользователь увидел ошибку
            inputUsd.value = 'Что то пошло не так';
            inputHrn.value = 'Что то пошло не так';
        }
    });
});

inputUsd.addEventListener('input', () => {
    const request = new XMLHttpRequest(); //создаем запрос на сервер

    request.open('GET', 'js/current.json'); 
   
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    request.send(); // отправляем запрос на сервер

    request.addEventListener('load', () => { 
        if(request.status === 200){
            const data = JSON.parse(request.response);
           
            inputRub.value = (+inputUsd.value / data.usd.rub).toFixed(2); 
            inputHrn.value = (+inputUsd.value / data.usd.hrn).toFixed(2);
        } else { 
            inputRub.value = 'Что то пошло не так';
            inputHrn.value = 'Что то пошло не так';
        }
    });
});

inputHrn.addEventListener('input', () => {
    const request = new XMLHttpRequest(); //создаем запрос на сервер

    request.open('GET', 'js/current.json'); 
   
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    request.send(); // отправляем запрос на сервер

    request.addEventListener('load', () => { 
        if(request.status === 200){
            const data = JSON.parse(request.response);
           
            inputRub.value = (+inputHrn.value / data.hrn.rub).toFixed(2); 
            inputUsd.value = (+inputHrn.value / data.hrn.usd).toFixed(2);
        } else { 
            inputRub.value = 'Что то пошло не так';
            inputUsd.value = 'Что то пошло не так';
        }
    });
});