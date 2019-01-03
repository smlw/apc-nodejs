var registerApp=new RegisterApp;function regApp(e){var s=$("#register-app_form").validate({errorContainer:".box-messages",errorClass:"text-danger",rules:{formDomainName:{required:!0,minlength:6},"step_3-host":{required:!0,minlength:4},"step_3-db-name":{required:!0},"step_3-user":{required:!0,minlength:4},"step_3-password":{required:!0,minlength:8},"step_3-table-name":{required:!0,minlength:2},"step_3-db-port":{minlength:2},"step_3-db-type":{required:!0},"step_3-col-user_id":{required:!0},"step_3-col-user_email":{required:!0},"step_3-col-user_phone":{required:!0},"step_3-col-user_password":{required:!0}},messages:{formDomainName:{required:"Пожалуйста, введите ссылку на ресурс вида http://domainname.ru/",url:"Пожалуйста, введите корректный адрес"},"step_3-host":{required:"Хост базы данных"},"step_3-db-name":{required:"Укажите имя базы данных"},"step_3-user":{required:"Пользователь базы данных"},"step_3-password":{required:"Пароль пользователя базы данных",minlength:"Минимальная длина от 8 символов"},"step_3-table-name":{required:"Имя таблицы содержащее пользователей"},"step_3-db-port":{required:"Порт подключения"},"step_3-db-type":{required:"Тип СУБД"},"step_3-col-user_id":{required:"Укажите имя поля user_id"},"step_3-col-user_email":{required:"Укажите имя поля user_email"},"step_3-col-user_phone":{required:"Укажите имя поля user_phone"},"step_3-col-user_password":{required:"Укажите имя поля user_password"}}}),t="#formDomainName",a={host:"#step_3-host",user:"#step_3-user",password:"#step_3-password",tableName:"#step_3-table-name",port:"#step_3-db-port",dbType:"#step_3-db-type",database:"#step_3-db-name",cols:{user_id:"#step_3-col-user_id",user_password:"#step_3-col-user_password",user_email:"#step_3-col-user_email",user_phone:"#step_3-col-user_phone"}};this.checkDomainName=function(){var e=$(t).val();s.element(t)?(registerApp.setDomainName(e),$(".btn-contolls").find(".res-step-1").addClass("d-block"),$(".btn-contolls").find(".btnCheckDomainName").addClass("d-none"),$("#test-l-1").prepend('<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Успех! </strong>Url сохранен! <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'),console.log(registerApp.getAppObject())):$(".btn-contolls").find(".res-step-1").removeClass("d-block")},this.checkRights=function(){var e={url:registerApp.getAppObject().domainName,secretKey:registerApp.getAppObject().secretKey};$.ajax({type:"POST",data:JSON.stringify(e),contentType:"application/json",url:"/app/add/rights"}).done(function(e){e.ok?(registerApp.setRights(),$("#test-l-2").prepend('<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Успех! </strong>'+e.msg+'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'),$(".btn-contolls").find(".btnCheckRights").addClass("d-none"),$(".btn-contolls").find(".res-step-2").addClass("d-block"),console.log(registerApp.getAppObject())):$("#test-l-2").prepend('<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>Ошибка! </strong>'+e.msg+'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'),console.log(e)})},this.checkDBData=function(){var s={host:$(a.host).val(),user:$(a.user).val(),password:$(a.password).val(),tableName:$(a.tableName).val(),port:$(a.port).val(),dbType:$(a.dbType).val()};console.log(s),$.ajax({type:"POST",data:JSON.stringify(s),contentType:"application/json",url:"/app/add/db"}).done(function(e){e.ok?(registerApp.setDBData(s.host,s.user,s.password,s.port,s.tableName,s.dbType),$("#test-l-3").prepend('<div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Успех! </strong>'+e.msg+'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'),$(".btn-contolls").find(".btncheckDBData").addClass("d-none"),$(".btn-contolls").find(".step_3_cols").addClass("d-block"),console.log(registerApp.getAppObject())):$("#test-l-3").prepend('<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>Ошибка! </strong>'+e.msg+'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'),console.log(e)}),console.log(registerApp.getAppObject())},this.setDBCols=function(){var e=$(a.cols.user_id).val(),s=$(a.cols.user_password).val(),t=$(a.cols.user_email).val(),r=$(a.cols.user_phone).val();e&&s&&t&&r||registerApp.setDBCol(e,s,t,r),console.log(registerApp.getAppObject())};var r=this;e.onclick=function(e){var s=e.target.getAttribute("data-action");s&&r[s]()}}new regApp(regAppForm);