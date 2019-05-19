var accountControlsParent = $('.accountParentNodeJS');
var changeElem = $('.accountChangeElem');
var cancelElem = $('.accountCancelElem');

$(function () {
    $('.setting_info_block').find('.setting_info_block_button').click(function (e) {
        $(this.parentNode.parentNode).toggleClass('d-flex d-none').next().toggleClass('d-none d-flex');
    });
    $('.setting_change_block').find('.settings_change_block_button').click(function () {
        $(this.parentNode.parentNode).toggleClass('d-flex d-none').prev().toggleClass('d-none d-flex');
    });
});

function changeUserPassword(userId) {
    var appId = '5ce0054f0590f83b301d5bd7'
    var data = {
        user: userId,
        app: appId
    };

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/apc/single'
    }).done(function (data) {
        console.log(data);
        if (!data.ok) {
            console.log(data.error);
        } else {
            console.log(data)
        }
    });
}
  