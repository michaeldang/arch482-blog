/**
 * Created by michaeldang on 3/7/16.
 */

var express = require('express'),
    router = express.Router(),
    sanitizer = require('sanitizer'),
    moment = require('moment'),
    dbconfig = require('./../config/database'),
    mysql = require('mysql'),
    flash = require('connect-flash');

router.use(flash());

router.get('/posts', isLoggedIn, function (req, res) {
    var query = "SELECT posts.*, users.username FROM posts, users WHERE posts.posterId = users.id ORDER BY date desc";

    var connection = mysql.createConnection(dbconfig.connection);
    connection.query('USE ' + dbconfig.database);
    connection.query(query, function (err, rows) {
        if (err) console.log(err);
        var results = rows;

        res.render('posts.ejs', {
            user: req.user,
            returningAfterSubmitting: req.postSuccessful,
            posts: results
        });
    });


});

router.get('/submit', isLoggedIn, function (req, res) {
    res.render('submit.ejs', {
        user: req.user,
        flash: req.flash()
    });
});

router.post('/submit', isLoggedIn, function (req, res) {
    var title = sanitizer.escape(req.body.postTitle);
    var comment = sanitizer.escape(req.body.postComment);
    if (!title || title === "" || !title.trim()) {
        req.flash('errorMessage', 'Title of post cannot be blank');
        res.redirect('back');
    } else if (!comment || comment === "" || !comment.trim()) {
        req.flash('errorMessage', 'Comment field cannot be blank');
        res.redirect('back');
    } else {
        var date = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log(date);
        var posterId = req.user.id;
        var insertQuery = "INSERT INTO posts (posterId, title, comment, date) values (?,?,?,?)";

        var connection = mysql.createConnection(dbconfig.connection);
        connection.query('USE ' + dbconfig.database);
        connection.query(insertQuery, [posterId, title, comment, date], function (err, rows) {
            if(err) {
                console.log(err);
                req.flash('errorMessage', err);
                res.redirect('back');
            } else {
                res.redirect('/posts?postSuccessful=true');
            }
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