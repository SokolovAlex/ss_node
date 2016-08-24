(function($) {

    var $form = $('#authForm');
    var $datepicker = $('#birthdate', $form);

    var registrationMode = false;

    $datepicker.datepicker();

    $datepicker.on('changeDate', function() {
            $datepicker.datepicker('hide');
    });

    var getFormJson = function($form) {
        var data = $form.serializeArray();
        return _.zipObject(_.map(data, 'name'), _.map(data, 'value'));
    };

    var dur = 500;

    var forLogin = $('.login-add', $form),
        forReg = $('.reg-add', $form);

    function toogleMode(){
        $form.toggleClass('registration');
        registrationMode = $form.hasClass('registration');

        if (registrationMode) {
            forLogin.slideUp(dur, function() { forReg.slideDown(); });
        } else {
            forReg.slideUp(dur, function() { forLogin.slideDown(); });
        }
    };

    $('.registration-toggler', $form).on('click', toogleMode);

    $('.registration-submit', $form).on('click', function(e) {
        e.preventDefault();

        var formData = getFormJson($form);

        var checkResult = ss.validators.checkUserData(formData.email, formData.password, formData.repeat
                ,formData.fname, formData.lname, formData.birthDate);

        if(!checkResult.valid) {
            return ss.alert.error(checkResult.messages);
        }

        $.ajax({
            url: '/auth/registration',
            method: 'post',
            data: formData
        }).then(function(response) {

            if(!response.success) {
                return ss.alert.error(response.message);
            }

            ss.alert.success("вы зарегистрировались успешно");

            toogleMode();
        });
    });

    $('.login-submit', $form).on('click', function(e) {
        e.preventDefault();

        $.ajax({
            url: '/auth/login',
            method: 'post',
            data: getFormJson($form)
        }).then(function(response) {

            if(!response.success) {
                return ss.alert.error(response.message);
            }

            window.location = response.redirect;
        });

    });

})(jQuery);
