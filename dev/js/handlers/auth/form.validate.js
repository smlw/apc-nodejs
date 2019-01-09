function Auth(elem) {

    var loader = '<svg width="10px"  height="10px"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-rolling" style="background: none;"><circle cx="50" cy="50" fill="none" stroke="#fafafa" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138" transform="rotate(353.928 50 50)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></circle></svg>';

    this.signin = function () {
        var login = $('#inputEmail').val();
        var password = $('#inputPassword').val();

        var data = {
            login: login,
            password: password
        }

        // Тут обработчик и запрос на сервер
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/auth/signin'
            // cache: false,
            // beforeSend: function () {
            //     $('button[type="submit"]').append(loader);
            // },
            // complete: function () {
            //     $('button[type="submit"]').find('svg').remove();
            // }
        })
    }

    var self = this;
    elem.onclick = function (e) {
        var target = e.target;
        var action = target.getAttribute('data-action');
        if (action) {
            self[action]();
        }
    };
}

new Auth(signinForm);