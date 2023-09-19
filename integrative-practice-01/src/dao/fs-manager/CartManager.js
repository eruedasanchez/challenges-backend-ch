import mongoose from "mongoose";

const cartsCollection = 'carts'; // 'products' coresponde al nombre de la coleccion definida en Atlas
const cartsSchema = new mongoose.Schema({
    title: {type: String, require: true, unique: true},
	description: {type: String, require: true, unique: true},
	code: {type: String, require: true, unique: true},
	price: {type: String, require: true},
	status: {type: Boolean, require: true},
	stock: {type: Number, require: true},
	category: {type: String, require: true},
	thumbnails: {type: [String], require: true}  
}, {strict: false})  

export const productsModel = mongoose.model(cartsCollection, cartsSchema);