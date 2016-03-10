/**
 * Created by michaeldang on 3/7/16.
 */
var express = require('express')
    , router = express.Router();

router.use(require('./posts'));
router.use(require('./about'));
router.use(require('./login'));

module.exports = router;