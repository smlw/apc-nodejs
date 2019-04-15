// jQuery.validator.addMethod("domain", function (value, element) {

//     return this.optional(element) || /(http:|https:)\/\/(www\.)?(\w|\d)+.+?\/gi/.test(value);
// }, "Please specify the correct domain for your documents");

function regApp(elem) {
  var loader = '<svg width="10px"  height="10px"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-rolling" style="background: none;"><circle cx="50" cy="50" fill="none" stroke="#fafafa" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138" transform="rotate(353.928 50 50)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></circle></svg>';

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
              minlength: 2
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
              required: "Имя базы данных"
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
              required: "Имя поля user_id"
          },
          "step_3-col-user_email": {
              required: "Имя поля user_email"
          },
          "step_3-col-user_phone": {
              required: "Имя поля user_phone"
          },
          "step_3-col-user_password": {
              required: "Имя поля user_password"
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

      var data = {
          url: inputVal
      }

      // Тут обработчик и запрос на сервер
      $.ajax({
          type: 'POST',
          data: JSON.stringify(data),
          contentType: 'application/json',
          url: '/app/add/url',
          cache: false,
          beforeSend: function(){
              $('.btnCheckDomainName').append(loader);
          },
          complete: function(){
              $('.btnCheckDomainName').find('svg').remove();
          }
      }).done(function (data) {
          if (!data.ok) {
              $('#test-l-1').prepend('<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>Ошибка! </strong>' + data.msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
              console.log(data);
          } else {
              App.setDomainName(inputVal);
              $('#test-l-1').prepend('<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Успех! </strong>'+data.msg+'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
              $('.btn-contolls').find('.res-step-1').addClass('d-block');
              $('.btn-contolls').find('.btnCheckDomainName').remove();

              // Устанавливаем значения для следующего шага
              var fileLink = inputVal + '/' + App.getAppObject().secretKey + '.html'
              $('#test-l-2').find('.domainName').text(inputVal).attr('href', inputVal);
              $('#test-l-2').find('.secretKey').text(App.getAppObject().secretKey);

              $('#test-l-2').find('.file-link').text(fileLink).attr('href', fileLink);

              console.log(App.getAppObject())
          }
      });
  };


  this.checkRightsMeta = function () {
      var data = {
          url: App.getAppObject().domainName,
          secretKey: App.getAppObject().secretKey
      };

      // Тут обработчик и запрос на сервер
      $.ajax({
          type: 'POST',
          data: JSON.stringify(data),
          contentType: 'application/json',
          url: '/app/add/rights/meta',
          cache: false,
          beforeSend: function(){
              $('.btnCheckRights').append(loader);
          },
          complete: function(){
              $('.btnCheckRights').find('svg').remove();
          }
      }).done(function (data) {
          if (!data.ok) {
              $('#test-l-2').prepend('<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>Ошибка! </strong>' + data.msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
              console.log(data);
          } else {
              App.setRights();
              $('#test-l-2').prepend('<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Успех! </strong>' + data.msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
              $('.btn-contolls').find('.btnCheckRights').addClass('d-none');
              $('.btn-contolls').find('.res-step-2').addClass('d-block');
              console.log(App.getAppObject());
              console.log(data);
          }
      });
  };

  this.checkRightsHtml = function () {
      var data = {
          url: App.getAppObject().domainName,
          secretKey: App.getAppObject().secretKey
      };

      // Тут обработчик и запрос на сервер
      $.ajax({
          type: 'POST',
          data: JSON.stringify(data),
          contentType: 'application/json',
          url: '/app/add/rights/html',
          cache: false,
          beforeSend: function(){
              $('.btnCheckRights').append(loader);
          },
          complete: function(){
              $('.btnCheckRights').find('svg').remove();
          }
      }).done(function (data) {
          if (!data.ok) {
              $('#test-l-2').prepend('<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>Ошибка! </strong>' + data.msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
              console.log(data);
          } else {
              App.setRights();
              $('#test-l-2').prepend('<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Успех! </strong>' + data.msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
              $('.btn-contolls').find('.btnCheckRights').addClass('d-none');
              $('.btn-contolls').find('.res-step-2').addClass('d-block');
              console.log(App.getAppObject());
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
      var port = $(inputs.DBData.port).val() || '';
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

      // Тут обработчик и запрос на сервер
      $.ajax({
          type: 'POST',
          data: JSON.stringify(DBdata),
          contentType: 'application/json',
          url: '/app/add/db',
          cache: false,
          beforeSend: function(){
              $('.btncheckDBData').append(loader);
          },
          complete: function(){
              $('.btncheckDBData').find('svg').remove();
          }
      }).done(function (data) {
          if (!data.ok) {
              $('#test-l-3').prepend('<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>Ошибка! </strong>' + data.msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
          } else {
              App.setDBData(DBdata.host, DBdata.database, DBdata.user, DBdata.password, DBdata.port, DBdata.tableName, DBdata.dbType);
              $('#test-l-3').prepend('<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Успех! </strong>' + data.msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
              $('.btn-contolls').find('.btncheckDBData').addClass('d-none');
              $('.btn-contolls').find('.res-step-3').addClass('d-block');

              // Выводим поля базы данных в селекты, что бы юзер выбрал и заполнил
              data.cols.forEach(function (item, i, arr) {
                  $('.step_3_cols select').append('<option value="' + item + '">' + item + '</option>')
              });
          }
      });
      console.log(App.getAppObject())
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
          App.setDBcol(user_id, user_password, user_email, user_phone);
          $('.setDBCols').addClass('d-none')
          $('.res-step-4').addClass('d-block')

          var fieldNames = ['Ключ проверки', 'Домен', 'Подтверждение прав', 'Хост БД', 'Имя БД', 'Логин БД', 'Пароль БД', 'Порт', 'Имя талицы', 'Тип Базы данных', 'Поле 1', 'Поле 2', 'Поле 3', 'Поле 4'];
          // For display app data on last screen 
          var app = App.getAppObject();
          var iter = 0;
          function recursive(obj) {
            for(var key in obj) {
              if(typeof obj[key] === 'object') {
                recursive(obj[key])
                
                console.log('obj[key]')
                console.log(obj[key])
                console.log('//obj[key]')
              } else {
                $('#app-info').append('<div class="db-fields_line"><div class="db_name">'+ fieldNames[iter] + ' : ' +'</div> <div class="db_val">'+ ' ' + obj[key]  +'</div></div>');
                iter++;
              }
            }
          }
          console.log(app)
          recursive(app);
      }

      console.log(App.getAppObject())
  };

  this.saveData = function(){
      var app = App.getAppObject();

      // console.log(app)

      var data = {
        url: app.domainName,
        secretKey: app.secretKey,
        host: app.DBData.host,
        database: app.DBData.database,
        user: app.DBData.user,
        password: app.DBData.password,
        tableName: app.DBData.tableName,
        port: app.DBData.port,
        dbType: app.DBData.DBtype,
        col_user_id: app.DBData.cols.user_id,
        col_user_password: app.DBData.cols.user_password,
        col_user_email: app.DBData.cols.user_email,
        col_user_phone: app.DBData.cols.user_phone,
      }

      // console.log('THIS IS DATA ')
      // console.log(data)

      $.ajax({
          type: 'POST',
          data: JSON.stringify(data),
          contentType: 'application/json',
          url: '/app/add/save',
          cache: false,
          beforeSend: function(){
            $('.btnSaveApp').append(loader);
          },
          complete: function(){
            $('.btnSaveApp').find('svg').remove();
          }
      }).done(function (data) {
          if (!data.ok) {
            console.log('FAIL');
            $('#test-l-5').prepend('<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>Ошибка! </strong>' + data.msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
          } else {
            console.log('OKS');
            $('#test-l-5').prepend('<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Успех! </strong>' + data.msg + ' <a href="/settings/">Перейти в настройки</a><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
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
new regApp(regAppForm);