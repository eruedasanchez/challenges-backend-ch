import mongoose from "mongoose";

const productIdQuantity = new mongoose.Schema({
    productId: Number,
    quantity: Number,
});

const cartsCollection = 'carts';                                            // 'carts' coresponde al nombre de la coleccion definida en Atlas
const cartsSchema = new mongoose.Schema({
    products: {type: [productIdQuantity], require: true}
})  

export const productsModel = mongoose.model(cartsCollection, cartsSchema);







