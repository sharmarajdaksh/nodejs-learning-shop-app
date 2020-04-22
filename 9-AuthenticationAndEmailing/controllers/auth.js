const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transporter = nodemailer.createTransport(
	sendgridTransport({
		auth: {
			api_key:
				'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',
		},
	})
);
exports.getLogin = (req, res, next) => {
	let message = req.flash('error');
	if (message.legth > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		errorMessage: message,
	});
};

exports.getSignup = (req, res, next) => {
	let message = req.flash('error');
	if (message.legth > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'Signup',
		errorMessage: message,
	});
};

exports.postLogin = (req, res, next) => {
	const { email, password } = req.body;

	User.findOne({ email: email })
		.then((user) => {
			if (!user) {
				req.flash('error', 'Invalid email or password');
				return res.redirect('/login');
			}

			bcrypt.compare(password, user.password).then((doMatch) => {
				if (doMatch) {
					req.session.isLoggedIn = true;
					req.session.user = user;
					return req.session.save((err) => {
						console.log(err);
						res.redirect('/');
					});
				}
				return res.redirect('/login');
			});
		})
		.catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
	const { email, password, confirmPassword } = req.body;

	// Check if user exists
	User.findOne({ email: email })
		.then((userDoc) => {
			if (userDoc) {
				req.flash(
					'error',
					'E-Mail exists already, please pick a different one.'
				);
				return res.redirect('/signup');
			}
			return bcrypt
				.hash(password, 12)
				.then((hashedPassword) => {
					const user = new User({
						email: email,
						password: hashedPassword,
						cart: { items: [] },
					});
					return user.save();
				})
				.then((result) => {
					res.redirect('/login');
					return transporter.sendMail({
						to: email,
						from: 'sharmarajdaksh@gmail.com.com',
						subject: 'Thank you for signing up!',
						html: '<h1>You successfully signed up!</h1>',
					});
				})
				.catch((err) => {
					console.log(err);
				});
		})
		.then(() => {
			res.redirect('/');
		})
		.catch((err) => {
			console.log('Error signing up: ', err);
		});
};

exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect('/');
	});
};

exports.getReset = (req, res, next) => {
	let message = req.flash('error');
	if (message.legth > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/reset', {
		path: '/reset',
		pageTitle: 'Reset Password',
		errorMessage: message,
	});
};

exports.postReset = (req, res, next) => {
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(err);
			return res.redirect('/reset');
		}
		const token = buffer.toString('hex');
		User.findOne({ email: req.body.email })
			.then((user) => {
				if (!user) {
					req.flash('error', 'No account with that email found');
					res.redirect('/reset');
				}
				user.resetToken = token;
				user.resetTokenExpiration = Date.now() + 3600000;
				return user.save();
			})
			.then((result) => {
                res.redirect('/');
				return transporter.sendMail({
					to: email,
					from: 'sharmarajdaksh@gmail.com.com',
					subject: 'Password reset!',
					html: `
                    <p>You requested a password reset!</p>
                    <p>Click this link <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
                `,
				});
			})
			.catch((err) => console.log(err));
	});
};
