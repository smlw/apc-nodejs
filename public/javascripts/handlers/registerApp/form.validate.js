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
            }
        },
        messages: {
            "formDomainName": {
                required: "Пожалуйста, введите ссылку на ресурс вида http://domainname.ru/",
                url: 'Пожалуйста, введите корректный адрес'
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
        }
    });

    var inputs = {
        domainName: '#formDomainName',
        DBData: {
            user: '#step_3-user',
            password: '#step_3-password',
            tableName: '#step_3-table-name',
            port: '#step_3-db-port',
            dbType: '#step_3-db-type'
        }
    };

    this.checkDomainName = function () {
        var inputVal = $(inputs.domainName).val();
        var validFlag = regForm.element(inputs.domainName);
        if (validFlag) {
            registerApp.setDomainName(inputVal);
            $('.btn-contolls').find('.res-step-1').addClass('d-block');
            $('.btn-contolls').find('.btnCheckDomainName').addClass('d-none');
            $('.result-message-1').append('<span class="text-success">OK</span>');
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

        registerApp.setRights();
        console.log(registerApp.getAppObject())
        
        var rightsFlag = registerApp.getAppObject().checkRights;
        if(rightsFlag){
            $('.result-message-2').append('<span class="text-success">OK</span>');
            $('.btn-contolls').find('.btnCheckRights').addClass('d-none');
            $('.btn-contolls').find('.res-step-2').addClass('d-block');
        }

        // Тут обработчик и запрос на сервер    
    };

    this.checkDBData = function () {
        var user = $(inputs.DBData.user).val();
        var password = $(inputs.DBData.password).val();
        var tableName = $(inputs.DBData.tableName).val();
        var port = $(inputs.DBData.port).val();
        var dbType = $(inputs.DBData.dbType).val();

        var data = {
            user: user,
            password: password,
            tableName: tableName,
            port: port || '',
            DBtype: dbType
        }

        registerApp.setDBData(data.user, data.password, data.port, data.tableName, data.DBtype);
        $('.result-message-3').append('<span class="text-success">OK</span>');
        $('.btn-contolls').find('.btncheckDBData').addClass('d-none');
        $('.btn-contolls').find('.res-step-3').addClass('d-block');

        console.log(registerApp.getAppObject())

        // Тут обработчик и запрос на сервер
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