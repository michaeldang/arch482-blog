/**
 * Created by michaeldang on 3/7/16.
 */
var express = require('express')
    , router = express.Router()

router.use(require('./posts'))

module.exports = router