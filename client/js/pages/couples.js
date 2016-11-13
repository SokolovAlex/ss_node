/**
 * Created by alexs_000 on 24.07.2016.
 */

$(document).ready(function() {
    document.addEventListener("endGame", function(e) {
        var time = Math.round(e.detail.gameDuration / 1000) + ' с';
        var fails = e.detail.fails;
        var $modal = $('#resultModal');
        $modal.find('.js-time').html(time);
        $modal.find('.js-fails').html(fails);
        $modal.modal('show')
    });
});