const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class Product {
	constructor(title, price, description, imageUrl, id, userId) {
		this.title = title;
		this.price = price;
		this.description = description;
		this.imageUrl = imageUrl;
		this.id = id ? new mongodb.ObjectId(id) : null;
		this.userId = userId;
	}

	save() {
		const db = getDb();
		let dbOp;
		if (this.id) {
			//Update
			dbOp = db
				.collection('products')
				.updateOne({ _id: this.id }, { $set: this });
		} else {
			dbOp = db.collection('products').insertOne(this);
		}
		return dbOp
			.then(result => {
				return result;
			})
			.catch(err => {
				console.log(err);
			});
	}

	static fetchAll() {
		const db = getDb();
		// find() returns a cursor.
		return db
			.collection('products')
			.find()
			.toArray()
			.then(products => products)
			.catch(err => {
				console.log(err);
			});
	}

	static findById(productId) {
		const db = getDb();
		return db
			.collection('products')
			.find({ _id: new mongodb.ObjectId(productId) })
			.next()
			.then(product => {
				return product;
			})
			.catch(err => console.log(err));
	}

	static deleteById(productId) {
		const db = getDb();
		return db
			.collection('products')
			.deleteOne({ _id: new mongodb.ObjectId(productId) })
			.then(result => console.log('Product deleted'))
			.catch(err => console.log(err));
	}
}

module.exports = Product;
