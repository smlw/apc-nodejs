var accountControlsParent=$(".accountParentNodeJS"),changeElem=$(".accountChangeElem"),cancelElem=$(".accountCancelElem");$(function(){$(".setting_info_block").find(".setting_info_block_button").click(function(n){$(this.parentNode.parentNode).toggleClass("d-flex d-none").next().toggleClass("d-none d-flex")}),$(".setting_change_block").find(".settings_change_block_button").click(function(){$(this.parentNode.parentNode).toggleClass("d-flex d-none").prev().toggleClass("d-none d-flex")})});