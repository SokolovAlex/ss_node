(function(angular) {
    'use strict';

    angular
        .module('common.mapTexture', [])
        .factory('mapTexture', mapTexture);

    function mapTexture() {
        var projection = d3.geo.equirectangular()
            .translate([1024, 512])
            .scale(325);

        return function(geojson, color) {
            var texture, context, canvas;

            canvas = d3.select("body").append("canvas")
                .style("display", "none")
                .attr("width", "2048px")
                .attr("height", "1024px");

            context = canvas.node().getContext("2d");

            var path = d3.geo.path()
                .projection(projection)
                .context(context);

            context.strokeStyle = "#eae8e8";
            context.lineWidth = 0.4;
            context.fillStyle = color || "#CDB380";

            context.beginPath();

            path(geojson);

            if (color) {
                context.fill();
            }

            context.stroke();

            texture = new THREE.Texture(canvas.node());
            texture.needsUpdate = true;

            canvas.remove();

            return texture;
        };
    }
})(angular);
