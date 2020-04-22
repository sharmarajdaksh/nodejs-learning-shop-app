const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

// const expressHbs = require('express-handlebars');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;

const app = express();

// app.engine('handlebars', expressHbs()); // Creates a new, non-built in engine
// app.set('view engine', 'pug');
// app.set('view engine', 'handlebars');
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/user');

app.use(
	bodyParser.urlencoded({
		extended: false
	})
);
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	User.findById('5e7c16ffb3e4501d3db3ce88')
		.then(user => {
			req.user = new User(user.name, user.email, user.cart, user._id);
			next();
		})
		.catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
	app.listen(3000);
});
