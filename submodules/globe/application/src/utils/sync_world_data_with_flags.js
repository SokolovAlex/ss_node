function sync_code() {
    var countryCodes = []; //flags
    var w = {objects:{countries: {geometries: []}}}; //worlds json

    _.each(w.objects.countries.geometries, function(item) {
        var finded = _.find(countryCodes, function(f) {
            return f.name == item.id;
        });
        if (finded) {
            item.code = finded.code
        }
    });
    console.log(JSON.stringify(w)); // result
}
