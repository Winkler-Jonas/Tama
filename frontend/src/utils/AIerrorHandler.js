import {CredentialError, EmailError, PasswordError, UserError} from "@/utils/errorHandler.js";

class CustomError extends Error {
    constructor(message, data = '') {
        super(message);
        this.name = this.constructor.name;
        this.data = data;
    }
}

export class Extern extends CustomError {}
export class InputError extends CustomError {}
export class Unexpected extends CustomError {}


const wsErrors = {
    "Input text is empty.": "error.ai.short",
    "Input text is too long.": "error.ai.long",
    "Gemini-Error": "error.ai.extern",
    "An unexpected error occurred.": "error.ai.unexpected",
}

const errorFactory = (type, message, data) => {
    switch (type) {
        case 'short' || 'long':
            return new InputError(message, data);
        case 'extern':
            return new Extern(message, data);
        case 'unexpected':
            return new Unexpected(message, data);
        default:
            return new Unexpected(message, data);
    }
};

export const getAIErrorMessage = (wsErrorMessage) => {
    if (!wsErrorMessage) {
        throw new Unexpected('Unexpected error occurred');
    }

    const message = wsErrors[wsErrorMessage]

    const [_, errorType] = message.split('.')
    return  errorFactory(errorType, message, '')
};
