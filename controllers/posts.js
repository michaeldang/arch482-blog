/**
 * Created by michaeldang on 3/7/16.
 */

var express = require('express'),
    router = express.Router()
var sanitizer = require('sanitizer')
var moment = require('moment')
var dbconfig = require('./../config/database')
var mysql = require('mysql'),
    connection = mysql.createConnection(dbconfig.connection)

connection.query('USE ' + dbconfig.database);

router.get('/post', isLoggedIn, function (req, res) {
    res.render('post.ejs', {
        user: req.user
    });
});

router.post('/post', isLoggedIn, function (req, res) {
    var title = sanitizer.escape(req.body.postTitle);
    var comment = sanitizer.escape(req.body.postComment);
    var date = moment().format('YYYY-MM-DD HH:MM:SS');
    var posterId = req.user.id;
    var insertQuery = "INSERT INTO posts (posterId, title, comment, date) values (?,?,?,?)";
    connection.query(insertQuery, [posterId, title, comment, date], function (err, rows) {
        res.redirect('/');
    });
});


// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router