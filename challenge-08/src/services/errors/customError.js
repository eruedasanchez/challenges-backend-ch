export class CustomError{
    static CustomError(name, msg, code, description){
        let error = new Error(msg);
        error.name = name;
        error.description = description;
        error.code = code;

        return error;
    } 
}