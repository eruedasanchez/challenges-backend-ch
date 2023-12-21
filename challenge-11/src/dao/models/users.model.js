import mongoose from "mongoose";

const usersCollection = 'users'; // 'users' coresponde al nombre de la coleccion definida en Atlas
const usersSchema = new mongoose.Schema({
    first_name: {type: String, require: true},
	last_name: {type: String, require: true},
    email: {type: String, require: true, unique:true},
	age: {type: Number, require: true},
	password: {type: String, require: true},
	cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts'},
	role: {type: String, default: 'user'}
})

export const usersModel = mongoose.model(usersCollection, usersSchema);
