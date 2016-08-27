(function($) {
    window.ss = window.ss || {};

    window.ss.getFormJson = function ($form) {
        var data = $form.serializeArray();
        return _.zipObject(_.map(data, 'name'), _.map(data, 'value'));
    };
})($);