import { ticketsDAO as DAO } from "../dao/factory.js";

class TicketsService {
    constructor(dao){
        this.dao = new dao(); 
    }
    
    async generateTicket(newTicket){
        return await this.dao.generate(newTicket);
    }
}

export const ticketsService = new TicketsService(DAO);

// capa intermedia que relaciona la capa de datos/persistencia con la capa de negocio/controllers