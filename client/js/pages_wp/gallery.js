$(document).ready(function() {

    $('.gallery').slick({
        lazyLoad: 'ondemand',
        centerMode: true,
        centerPadding: '60px',
        slidesToShow: 2,
        autoplay: true,
        draggable: true,
        dots: true,
        speed: 500,
        slidesToScroll: 1

    });

});
