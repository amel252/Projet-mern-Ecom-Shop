class ErrorHandler extends Error {
    constructor(message, statusCode) {
        //  errorHandler va hérité les function de son paret Error , en utilisant super pour récupérer la fonction sans la réécrire une 2 eme fois
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}
export default ErrorHandler;
//  ca nous permet d'afficher l'erreur sur le terminal
