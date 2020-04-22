const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	req.user
		.createProduct({
			title,
			price,
			imageUrl,
			description,
			userId: req.user.id
		})
		.then(result => {
			console.log('Product created');
			res.redirect('/admin/products');
		})
		.catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if (editMode !== 'true') {
		return res.redirect('/');
	}

	const productId = req.params.productId;
	req.user
		.getProducts({ where: { id: productId } })
		// Product.findByPk(productId)
		.then(product => {
			if (!product) {
				return res.redirect('/');
			}
			res.render('admin/edit-product', {
				pageTitle: 'Edit Product',
				path: '/admin/edit-product',
				editing: editMode === 'true',
				product
			});
		})
		.catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId;
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;

	Product.update(
		{
			title: title,
			imageUrl: imageUrl,
			price: price,
			description: description
		},
		{
			where: {
				id: prodId
			}
		}
	)
		.then(_ => {
			console.log('Product Updated');
			res.redirect('/admin/products');
		})
		.catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
	const productId = req.body.productId;
	Product.destroy({ where: { id: productId } })
		.then(_ => {
			console.log('Product removed');
			res.redirect('/admin/products');
		})
		.catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
	req.user
		.getProducts()
		.then(products => {
			res.render('admin/products', {
				products,
				pageTitle: 'Admin Products',
				path: '/admin/products'
			});
		})
		.catch(err => console.log(err));
};
