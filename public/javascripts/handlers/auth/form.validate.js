function Auth(t){this.signin=function(){var t={login:$("#inputEmail").val(),password:$("#inputPassword").val()};$.ajax({type:"POST",data:JSON.stringify(t),contentType:"application/json",url:"/auth/signin"})};var i=this;t.onclick=function(t){var n=t.target.getAttribute("data-action");n&&i[n]()}}new Auth(signinForm);