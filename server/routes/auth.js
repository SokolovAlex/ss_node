var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    res.json({
        msg: 'API is running'
    });
});

router.post('/registration', function (req, res) {

    console.log("REgistration body", res.body);

    res.json({
        msg: 'API is running'
    });
});

module.exports = router;