if($("#securityIsActive").attr("checked") != 'checked') { 
    $('.account-content_overlay').addClass('account-content_overlay-disable')
}

$('#securityIsActive').on('change', function(){
    if(this.checked){
        $('.account-content_overlay').removeClass('account-content_overlay-disable')
    } else {
        $('.account-content_overlay').addClass('account-content_overlay-disable')
    }
});