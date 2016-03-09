/**
 * Created by michaeldang on 3/7/16.
 */

var express = require('express'),
    router = express.Router(),
    sanitizer = require('sanitizer'),
    moment = require('moment'),
    dbconfig = require('./../config/database'),
    mysql = require('mysql'),
    connection = mysql.createConnection(dbconfig.connection),
    flash = require('connect-flash')

connection.query('USE ' + dbconfig.database);

router.use(flash());

router.get('/post', isLoggedIn, function (req, res) {
    res.render('post.ejs', {
        user: req.user,
        flash: req.flash()
    });
});

router.post('/post', isLoggedIn, function (req, res) {
    var title = sanitizer.escape(req.body.postTitle);
    var comment = sanitizer.escape(req.body.postComment);
    if (!title || title === "" || !title.trim()) {
        req.flash('errorMessage', 'Title of post cannot be blank');
        res.redirect('back');
    } else if (!comment || comment === "" || !comment.trim()) {
        req.flash('errorMessage', 'Comment field cannot be blank');
        res.redirect('back');
    } else {
        var date = moment().format('YYYY-MM-DD HH:MM:SS');
        var posterId = req.user.id;
        var insertQuery = "INSERT INTO posts (posterId, title, comment, date) values (?,?,?,?)";
        connection.query(insertQuery, [posterId, title, comment, date], function (err, rows) {
            res.redirect('/?postSuccessful=true');
        });
    }
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