$(document).ready(function() {

    var $gallery = $('.gallery');

    $gallery.slick({
        lazyLoad: false,
        slidesToShow: 1,
        autoplay: false,
        draggable: true,
        dots: true,
        speed: 1000,
        slidesToScroll: 1,
        adaptiveHeight: true
    });

    $('.gallery__thumbnail').on('click', function(e) {
        var id = $(e.currentTarget).data('id');
        var index = $(e.currentTarget).data('index');
        $gallery.slick('slickGoTo', parseInt(index, 10));
    });
});