var registerApp = new RegisterApp();

// jQuery.validator.addMethod("domain", function (value, element) {

//     return this.optional(element) || /(http:|https:)\/\/(www\.)?(\w|\d)+.+?\/gi/.test(value);
// }, "Please specify the correct domain for your documents");

function regApp(elem) {
    var regForm = $('#register-app_form').validate({
        errorContainer: ".box-messages",
        errorClass: "text-danger",

        rules: {
            "formDomainName": {
                required: true,
                minlength: 6
                // domain: true
            },
            "step_3-host": {
                required: true,
                minlength: 4
            },
            "step_3-db-name": {
                required: true
            },
            "step_3-user": {
                required: true,
                minlength: 4
            },
            "step_3-password": {
                required: true,
                minlength: 8
            },
            "step_3-table-name": {
                required: true,
                minlength: 2
            },
            "step_3-db-port": {
                minlength: 2
            },
            "step_3-db-type": {
                required: true
            },
            "step_3-col-user_id": {
                required: true
            },
            "step_3-col-user_email": {
                required: true
            },
            "step_3-col-user_phone": {
                required: true
            },
            "step_3-col-user_password": {
                required: true
            }
        },
        messages: {
            "formDomainName": {
                required: "Пожалуйста, введите ссылку на ресурс вида http://domainname.ru/",
                url: 'Пожалуйста, введите корректный адрес'
            },
            "step_3-host": {
                required: "Хост базы данных",
            },
            "step_3-db-name": {
                required: "Укажите имя базы данных"
            },
            "step_3-user": {
                required: "Пользователь базы данных",
            },
            "step_3-password": {
                required: "Пароль пользователя базы данных",
                minlength: "Минимальная длина от 8 символов"
            },
            "step_3-table-name": {
                required: "Имя таблицы содержащее пользователей",
            },
            "step_3-db-port": {
                required: "Порт подключения"
            },
            "step_3-db-type": {
                required: "Тип СУБД",
            },
            "step_3-col-user_id": {
                required: "Укажите имя поля user_id"
            },
            "step_3-col-user_email": {
                required: "Укажите имя поля user_email"
            },
            "step_3-col-user_phone": {
                required: "Укажите имя поля user_phone"
            },
            "step_3-col-user_password": {
                required: "Укажите имя поля user_password"
            }
        }
    });

    var inputs = {
        domainName: '#formDomainName',
        DBData: {
            host: '#step_3-host',
            database: '#step_3-db-name',
            user: '#step_3-user',
            password: '#step_3-password',
            tableName: '#step_3-table-name',
            port: '#step_3-db-port',
            dbType: '#step_3-db-type',
            cols: {
                user_id: '#step_3-col-user_id',
                user_password: '#step_3-col-user_password',
                user_email: '#step_3-col-user_email',
                user_phone: '#step_3-col-user_phone',
            }
        }
    };

    this.checkDomainName = function () {
        var inputVal = $(inputs.domainName).val();
        var validFlag = regForm.element(inputs.domainName);
        if (validFlag) {
            registerApp.setDomainName(inputVal);
            $('.btn-contolls').find('.res-step-1').addClass('d-block');
            $('.btn-contolls').find('.btnCheckDomainName').addClass('d-none');
            $('#test-l-1').prepend('<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Успех! </strong>Url сохранен! <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
            console.log(registerApp.getAppObject())
        } else {
            $('.btn-contolls').find('.res-step-1').removeClass('d-block');
        }
    };


    this.checkRights = function () {
        var data = {
            url: registerApp.getAppObject().domainName,
            secretKey: registerApp.getAppObject().secretKey
        };

        // Тут обработчик и запрос на сервер
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/app/add/rights'
        }).done(function (data) {
            if (!data.ok) {
                // $('#test-l-2').append('<span class="text-danger">'+ data.msg +'</span>');
                $('#test-l-2').prepend('<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>Ошибка! </strong>' + data.msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
                console.log(data);
            } else {
                registerApp.setRights();
                $('#test-l-2').prepend('<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Успех! </strong>' + data.msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
                $('.btn-contolls').find('.btnCheckRights').addClass('d-none');
                $('.btn-contolls').find('.res-step-2').addClass('d-block');
                console.log(registerApp.getAppObject());
                console.log(data);
            }
        });
    };

    this.checkDBData = function () {
        var host = $(inputs.DBData.host).val();
        var database = $(inputs.DBData.database).val();
        var user = $(inputs.DBData.user).val();
        var password = $(inputs.DBData.password).val();
        var tableName = $(inputs.DBData.tableName).val();
        var port = $(inputs.DBData.port).val();
        var dbType = $(inputs.DBData.dbType).val();

        var DBdata = {
            host: host,
            database: database,
            user: user,
            password: password,
            tableName: tableName,
            port: port,
            dbType: dbType
        }

        console.log(DBdata)
        // Тут обработчик и запрос на сервер
        $.ajax({
            type: 'POST',
            data: JSON.stringify(DBdata),
            contentType: 'application/json',
            url: '/app/add/db'
        }).done(function (data) {
            if (!data.ok) {
                $('#test-l-3').prepend('<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>Ошибка! </strong>' + data.msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
            } else {
                registerApp.setDBData(DBdata.host, DBdata.database, DBdata.user, DBdata.password, DBdata.port, DBdata.tableName, DBdata.dbType);
                $('#test-l-3').prepend('<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Успех! </strong>' + data.msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
                $('.btn-contolls').find('.btncheckDBData').addClass('d-none');
                $('.btn-contolls').find('.res-step-3').addClass('d-block');

                // Выводим поля базы данных в селекты, что бы юзер выбрал и заполнил
                data.cols.forEach(function (item, i, arr) {
                    $('.step_3_cols select').append('<option value="' + item + '">' + item + '</option>')
                });
            }
        });
        console.log(registerApp.getAppObject())
    };


    this.setDBCols = function () {
        var user_id = $(inputs.DBData.cols.user_id).val();
        var user_password = $(inputs.DBData.cols.user_password).val();
        var user_email = $(inputs.DBData.cols.user_email).val();
        var user_phone = $(inputs.DBData.cols.user_phone).val();
       
        var validUser_id        = regForm.element(inputs.DBData.cols.user_id);
        var validUser_password  = regForm.element(inputs.DBData.cols.user_password);
        var validUser_email     = regForm.element(inputs.DBData.cols.user_email);
        var validUser_phone     = regForm.element(inputs.DBData.cols.user_phone);

        if(validUser_id && validUser_password && validUser_email && validUser_phone){
            registerApp.setDBcol(user_id, user_password, user_email, user_phone);
            $('.setDBCols').addClass('d-none')
            $('.res-step-4').addClass('d-block')
        }

        console.log(registerApp.getAppObject())
    };

    var self = this;
    elem.onclick = function (e) {
        var target = e.target;
        var action = target.getAttribute('data-action');
        if (action) {
            self[action]();
        }
    };

}
new regApp(regAppForm);