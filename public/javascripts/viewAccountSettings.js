var accountControlsParent=$(".accountParentNodeJS"),changeElem=$(".accountChangeElem"),cancelElem=$(".accountCancelElem"),loader='<svg width="10px"  height="10px"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-rolling" style="background: none;"><circle cx="50" cy="50" fill="none" stroke="#fafafa" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138" transform="rotate(353.928 50 50)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></circle></svg>';function updateAPCUsers(){var e=$(".appIdSingleApp").attr("data-appId");console.log(e);var n={appId:e};$.ajax({type:"POST",data:JSON.stringify(n),contentType:"application/json",url:"/apc/single/loadUsers",beforeSend:function(){$(".btn-warning").append(loader)},complete:function(){$(".btn-warning").find("svg").remove()}}).done(function(e){e.ok?console.log("set ok"+e):console.log("set !ok"+e.error)})}function changeUserPassword(e){var n={user:e,app:$(".appIdSingleApp").attr("data-appId")};$.ajax({type:"POST",data:JSON.stringify(n),contentType:"application/json",url:"/apc/single",beforeSend:function(){$(".btnChangeSingeApc svg").addClass("animate-rotate")},complete:function(){$(".btnChangeSingeApc svg").removeClass("animate-rotate")}}).done(function(e){e.ok?console.log(e):console.log(e.error)})}$(function(){$(".setting_info_block").find(".setting_info_block_button").click(function(e){$(this.parentNode.parentNode).toggleClass("d-flex d-none").next().toggleClass("d-none d-flex")}),$(".setting_change_block").find(".settings_change_block_button").click(function(){$(this.parentNode.parentNode).toggleClass("d-flex d-none").prev().toggleClass("d-none d-flex")})});