(function(){
    var $el = null;
    var duration = 1000;
    var delay = 2000;

    window.ss = window.ss || {};

    var html = '<div class="ss-alert"><div class="ss-alert__text"><%= text %> </div></div>';

    function init (text) {
        if(!$el) {
            $('body').append(_.template(html)({ text: text}));
            $el = $('body').find('.ss-alert').last();
        } else {
            $el.find('.ss-alert__text').text(text);
        }
    }

    function show () {
        $el.fadeIn(duration, function() {
            setTimeout(function() {
                $el.fadeOut(duration);
            }, 2000)
        });
    }

    window.ss.alert = {
        success: function(msg) {
            init(msg);
            $el.removeClass('error');
            $el.addClass('success');
            show();
        },
        error: function(msg) {
            init(msg);
            $el.removeClass('success');
            $el.addClass('error');
            show();
        }
    };
})();

