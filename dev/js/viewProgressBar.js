$( document ).ajaxStart(function() {
    $( '.progress' ).show(); 
});

$( document ).ajaxStop(function() {
    $( '.progress' ).hide();
});

