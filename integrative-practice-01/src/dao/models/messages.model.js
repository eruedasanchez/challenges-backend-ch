import mongoose from "mongoose";

const messagesCollection = 'messages';                                            // 'messages' coresponde al nombre de la coleccion definida en Atlas
const messagesSchema = new mongoose.Schema({
    user: {type: String, require: true, unique: true},
    message: {type: String, require: true}
})  

export const productsModel = mongoose.model(messagesCollection, messagesSchema);