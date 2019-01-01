$(document).ready(function () {

    var stepper = new Stepper(document.querySelector('.bs-stepper'));

    $('.btn-prev').on("click", function () {
        stepper.previous()
    });

    $('.btn-next').on("click", function () {
        stepper.next()
    });
})