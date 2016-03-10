/**
 * Created by michaeldang on 3/7/16.
 */

var express = require('express'),
    router = express.Router(),
    sanitizer = require('sanitizer'),
    moment = require('moment'),
    dbconfig = require('./../config/database'),
    mysql = require('mysql'),
    flash = require('connect-flash'),
    login = require('./login');

router.use(flash());

router.get('/posts', login.isLoggedIn, function (req, res) {
    var query = "SELECT posts.*, users.username FROM posts, users WHERE posts.posterId = users.id ORDER BY date desc";

    var connection = mysql.createConnection(dbconfig.connection);
    connection.query('USE ' + dbconfig.database);
    connection.query(query, function (err, rows) {
        if (err) console.log(err);
        var results = rows;

        res.render('pages/posts', {
            user: req.user,
            flash: req.flash(),
            postSuccessful: req.postSuccessful,
            posts: results
        });
    });


});

router.get('/submit', login.isLoggedIn, function (req, res) {
    res.render('pages/submit', {
        user: req.user,
        flash: req.flash()
    });
});

router.post('/submit', login.isLoggedIn, function (req, res) {
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
                req.flash('postSuccessful', 'Your post has been successfully submitted!');
                res.redirect('/posts');
            }
        });
    }
});

module.exports = router;