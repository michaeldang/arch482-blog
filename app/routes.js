// app/routes.js
module.exports = function(app) {

    app.use(require('./../controllers/'));

	app.get('/', function(req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/posts')
        } else {
            res.render('pages/index'); // load the index.ejs file
        }

	});
};

