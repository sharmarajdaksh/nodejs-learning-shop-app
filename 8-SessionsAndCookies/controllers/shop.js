const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
	Product.find()
		// .select('title price -_id')
		// .populate('userId', 'name')
		.then((products) => {
			res.render('shop/product-list', {
				products,
				path: '/products',
				pageTitle: 'Products',
				isAuthenticated: req.isAuthenticated,
			});
		})
		.catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
	const productId = req.params.productId;

	Product.findById(productId)
		.then((product) => {
			res.render('shop/product-detail', {
				product,
				pageTitle: product.title,
				path: '/products',
				isAuthenticated: req.isAuthenticated,
			});
		})
		.catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
	Product.find()
		.then((products) => {
			res.render('shop/index', {
				products,
				path: '/',
				pageTitle: 'Shop',
				isAuthenticated: req.isAuthenticated,
			});
		})
		.catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
	req.session.user
		.populate('cart.items.productId')
		.execPopulate()
		.then((user) => {
			const products = user.cart.items;
			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Your cart',
				products,
				isAuthenticated: req.isAuthenticated,
			});
		})
		.catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
	const productId = req.body.productId;
	Product.findById(productId)
		.then((product) => {
			return req.user.addToCart(product);
		})
		.then((result) => {
			res.redirect('/cart');
		})
		.catch((err) => console.log(err));
};

exports.postCartDeleteItem = (req, res, next) => {
	const productId = req.body.productId;
	req.session.user
		.removeFromCart(productId)
		.then((result) => {
			res.redirect('/cart');
		})
		.catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', { path: '/checkout', pageTitle: 'Checkout' });
};

exports.getOrders = (req, res, next) => {
	Order.find({ 'user.userId': req.user._id })
		.then((orders) => {
			res.render('shop/orders', {
				path: '/orders',
				pageTitle: 'Your orders',
				orders,
				isAuthenticated: req.isAuthenticated,
			});
		})
		.catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
	req.session.user
		.populate('cart.items.productId')
		.execPopulate()
		.then((user) => {
			const products = user.cart.items.map((i) => {
				return {
					quantity: i.quantity,
					productData: { ...i.productId._doc },
				};
			});
			const order = new Order({
				user: { name: req.user.name, userId: req.user._id },
				products,
			});
			return order.save();
		})
		.then(() => {
			return req.user.clearCart();
		})
		.then(() => {
			res.redirect('/orders');
		})
		.catch((err) => console.log(err));
};
