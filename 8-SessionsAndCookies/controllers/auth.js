exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		isAuthenticated: req.isAuthenticated,
	});
};

exports.postLogin = (req, res, next) => {
	req.session.isLoggedIn = true;
	req.session.user = user;
	res.redirect('/');
};

exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect('/');
	});
};
