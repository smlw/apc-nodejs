var accountControlsParent=$(".accountParentNodeJS"),changeElem=$(".accountChangeElem"),cancelElem=$(".accountCancelElem");function changeUserPassword(n){var e={user:n,app:$(".appIdSingleApp").attr("data-appId")};$.ajax({type:"POST",data:JSON.stringify(e),contentType:"application/json",url:"/apc/single",beforeSend:function(){$(".btnChangeSingeApc svg").addClass("animate-rotate")},complete:function(){$(".btnChangeSingeApc svg").removeClass("animate-rotate")}}).done(function(n){n.ok?console.log(n):console.log(n.error)})}$(function(){$(".setting_info_block").find(".setting_info_block_button").click(function(n){$(this.parentNode.parentNode).toggleClass("d-flex d-none").next().toggleClass("d-none d-flex")}),$(".setting_change_block").find(".settings_change_block_button").click(function(){$(this.parentNode.parentNode).toggleClass("d-flex d-none").prev().toggleClass("d-none d-flex")})});