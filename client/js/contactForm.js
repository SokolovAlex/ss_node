(function($) {
    var $form = $('#contactForm');

    $('.contactForm_submit', $form).on('click', function(e) {
        e.preventDefault();

        var formData = ss.getFormJson($form);
        var checkResult = ss.validators.checkContactForm(formData.email, formData.name, formData.message);

        if(!checkResult.valid) {
            return ss.alert.error(checkResult.messages);
        }

        $.ajax({
            url: '/api/request',
            method: 'post',
            data: formData
        }).then(function(response) {

            if(!response.success) {
                return ss.alert.error(response.message);
            }

            $form.reset();
            return ss.alert.success(response.message);
        });

    });

})(jQuery);
