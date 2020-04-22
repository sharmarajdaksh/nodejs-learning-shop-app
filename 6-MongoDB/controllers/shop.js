const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
	Product.fetchAll()
		.then(products => {
			res.render('shop/product-list', {
				products,
				path: '/products',
				pageTitle: 'Products'
			});
		})
		.catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
	const productId = req.params.productId;

	Product.findByPk(productId)
		.then(product => {
			res.render('shop/product-detail', {
				product,
				pageTitle: product.title,
				path: '/products'
			});
		})
		.catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
	Product.fetchAll()
		.then(products => {
			res.render('shop/index', {
				products,
				path: '/',
				pageTitle: 'Shop'
			});
		})
		.catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
	req.user
		.getCart()
		.then(products => {
			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Your cart',
				products
			});
		})
		.catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
	const productId = req.body.productId;
	Product.findById(productId)
		.then(product => {
			return req.user.addToCart(product);
		})
		.then(result => {
			res.redirect('/cart');
		})
		.catch(err => console.log(err));
};

exports.postCartDeleteItem = (req, res, next) => {
	const productId = req.body.productId;
	req.user
		.deleteItemFromCart(productId)
		.then(result => {
			res.redirect('/cart');
		})
		.catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', { path: '/checkout', pageTitle: 'Checkout' });
};

exports.getOrders = (req, res, next) => {
	req.user
		.getOrders()
		.then(orders => {
			res.render('shop/orders', {
				path: '/orders',
				pageTitle: 'Your orders',
				orders
			});
		})
		.catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
	let fetchedCart;
	req.user
		.addOrder()
		.then(() => {
			res.redirect('/orders');
		})
		.catch(err => console.log(err));
};
