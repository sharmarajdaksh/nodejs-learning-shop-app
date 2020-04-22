const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const expressHbs = require('express-handlebars');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

// app.engine('handlebars', expressHbs()); // Creates a new, non-built in engine
// app.set('view engine', 'pug');
// app.set('view engine', 'handlebars');
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(
	bodyParser.urlencoded({
		extended: false
	})
);
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	User.findById('5e83db68dace814e962b3edc')
		.then(user => {
			req.user = user;
			next();
		})
		.catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
	.connect(
		'mongodb+srv://sharmarajdaksh:b5kHdo91ZlAn@cluster0-djq23.mongodb.net/shop?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'
	)
	.then(result => {
		User.findOne().then(user => {
			if (!user) {
				const user = new User({
					name: 'Dex',
					email: 'dex@test.com',
					cart: { items: [] }
				});
				user.save();
			}
		});

		app.listen(3000);
	})
	.catch(err => console.log(err));
