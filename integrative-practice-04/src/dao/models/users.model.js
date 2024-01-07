import mongoose from "mongoose";

const usersCollection = 'users'; 
const usersSchema = new mongoose.Schema({
    first_name: {type: String, require: true},
	last_name: {type: String, require: true},
    email: {type: String, require: true, unique:true},
	age: {type: Number, require: true},
	password: {type: String, require: true},
	cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts'},
	role: {type: String, default: 'user'},
	last_connection: {type: Object} 
})

export const usersModel = mongoose.model(usersCollection, usersSchema);
