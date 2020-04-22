const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;

	let product = new Product({
		title,
		price,
		description,
		imageUrl,
		userId: req.user._id,
	});
	product
		.save()
		.then((result) => {
			console.log('Created product');
			res.redirect('/admin/products');
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if (editMode !== 'true') {
		return res.redirect('/');
	}

	const productId = req.params.productId;
	Product.findById(productId)
		.then((product) => {
			if (!product) {
				return res.redirect('/');
			}
			res.render('admin/edit-product', {
				pageTitle: 'Edit Product',
				path: '/admin/edit-product',
				editing: editMode === 'true',
				product,
				isAuthenticated: req.isAuthenticated,
			});
		})
		.catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId;
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;

	const product = Product.findById(prodId)
		.then((product) => {
			product.title = title;
			product.imageUrl = imageUrl;
			product.price = price;
			product.description = description;
			return product.save();
		})
		.then(() => {
			console.log('Product Updated');
			res.redirect('/admin/products');
		})
		.catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
	const productId = req.body.productId;
	Product.findByIdAndDelete(productId)
		.then(() => {
			console.log('Product removed');
			res.redirect('/admin/products');
		})
		.catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
	Product.find()
		.then((products) => {
			res.render('admin/products', {
				products,
				pageTitle: 'Admin Products',
				path: '/admin/products',
				isAuthenticated: req.isAuthenticated,
			});
		})
		.catch((err) => console.log(err));
};
