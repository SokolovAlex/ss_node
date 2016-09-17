const _ = require("lodash");

module.exports = {

    tours: (tours) => {
        return _.map(tours, tour => {
            return tour;
        });
    }
};