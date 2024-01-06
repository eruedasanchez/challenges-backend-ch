import mongoose from "mongoose";

const messagesCollection = 'messages';                                            // 'messages' coresponde al nombre de la coleccion definida en Atlas
const messagesSchema = new mongoose.Schema({
    user: {type: String, require: true},
    message: {type: String, require: true}
})  

export const messagesModel = mongoose.model(messagesCollection, messagesSchema);