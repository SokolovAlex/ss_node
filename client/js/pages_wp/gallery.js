$(document).ready(function() {
    var $gallery = $('.gallery');

    $gallery.slick({
        lazyLoad: 'ondemand',
        slidesToShow: 1,
        autoplay: true,
        draggable: true,
        dots: true,
        speed: 500,
        slidesToScroll: 1
    });

    $('.gallery__thumbnail').on('click', function(e) {
        var id = $(e.currentTarget).data('id');
        var index = $(e.currentTarget).data('index');
        $gallery.slick('slickGoTo', parseInt(index, 10) );
    });

});
