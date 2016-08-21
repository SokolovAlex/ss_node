(function($) {

    var $form = $('#authForm');

    var registrationMode = false;

    $('#birthdate', $form).datepicker();


    var getFormJson = function($form) {
        var data = $form.serializeArray();
        return _.zipObject(_.map(data, 'name'), _.map(data, 'value'));
    };

    var dur = 500;

    var forLogin = $('.login-add', $form),
        forReg = $('.reg-add', $form);

    $('.registration-toggler', $form).on('click', function() {
        $form.toggleClass('registration');
        registrationMode = $form.hasClass('registration');


        if (registrationMode) {
            forLogin.slideUp(dur, function() { forReg.slideDown(); });
        } else {
            forReg.slideUp(dur, function() { forLogin.slideDown(); });
        }
    });


    $('.registration-submit', $form).on('click', function(e) {
        e.preventDefault();
        console.log('reg', getFormJson($form));

    });

    $('.login-submit', $form).on('click', function(e) {
        e.preventDefault();


        console.log('login', getFormJson($form));

    });

})(jQuery);
