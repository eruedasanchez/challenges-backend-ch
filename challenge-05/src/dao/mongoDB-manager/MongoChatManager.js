import { messagesModel } from "../models/messages.model.js";

class MongoChatManager{
    
    /**** Metodos ****/
    
    async getChat(){
        return await messagesModel.find();
    }

    async getChatByUser(user) {
        return await messagesModel.findOne({user});
    }

    async addToChat(msg){
        let newMessage = new messagesModel(msg);
        await newMessage.save();
    }
}

export default MongoChatManager;
