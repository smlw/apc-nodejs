function Auth(elem) {

    var loader = '<svg width="10px"  height="10px"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-rolling" style="background: none;"><circle cx="50" cy="50" fill="none" stroke="#fafafa" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138" transform="rotate(353.928 50 50)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></circle></svg>';

    var signup_form = $('#signup_form').validate({
        errorContainer: ".box-messages",
        errorClass: "text-danger",
        rules: {
            "signup_username": {
                required: true,
                minlength: 6
                // domain: true
            }
        },
        messages: {
            "signup_username": {
                required: "Пожалуйста, введите ссылку на ресурс вида http://domainname.ru/",
                url: 'Пожалуйста, введите корректный адрес'
            },
        }
    })

    this.sendSignupForm = function () {
        var email = $('#signup_email').val();
        var password = $('#signup_password').val();
        var repassword = $('#signup_repassword').val();

        var data = {
            email: email,
            password: password,
            repassword: repassword
        }

        console.log(data)

        // Тут обработчик и запрос на сервер
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/auth/signup',
            cache: false,
            beforeSend: function () {
                $('button[type="submit"]').append(loader);
            },
            complete: function () {
                $('button[type="submit"]').find('svg').remove();
            }
        }).done(function (data) {
            if (!data.ok) {
                console.log('FAIL');
                $('.box-message').append('<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>Ошибка! </strong>' + data.msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
            } else {
                console.log('OKS');
                $('.box-message').append('<div class="alert alert-success alert-dismissible fade show" role="alert">Вы успешно зарегестрировались  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
            }
        });
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

new Auth(signup_form);