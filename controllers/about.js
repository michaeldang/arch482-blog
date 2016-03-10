/**
 * Created by michaeldang on 3/7/16.
 */


var express = require('express'),
    router = express.Router();

router.get('/about', function (req, res) {
    res.render('pages/about');
});

module.exports = router;

