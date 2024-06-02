import api from "@/services/api.js";

class CustomError extends Error {
    constructor(message, data = '') {
        super(message);
        this.name = this.constructor.name;
        this.data = data;
    }
}

export class PasswordError extends CustomError {}
export class EmailError extends CustomError {}
export class UserError extends CustomError {}
export class CredentialError extends CustomError {}
export class UnexpectedError extends CustomError {}

const apiErrors = {
    "Username is required": "error.user.required",
    "Email not verified": "error.email.verified",
    "Invalid credentials": "error.credentials.mismatch",
    "This password is too common.": "error.pass.common",
    "Username too short": "error.user.short",
    "SystemError": "error.system.unexpected",
    "Enter a valid email address.": "error.email.valid",
    "Not a valid string." : "error.user.corrupt"
}

const errorFactory = (type, message, data) => {
    console.log(`Error-type: ${type} Message: ${message} Data: ${data}`)
    switch (type) {
        case 'user':
            return new UserError(message, data);
        case 'email':
            return new EmailError(message, data);
        case 'pass':
            return new PasswordError(message, data);
        case 'credentials':
            return new CredentialError(message, data);
        case 'system':
        default:
            return new UnexpectedError(message, data);
    }
};

export const getAPIErrorMessage = (apiResponseError) => {
    console.log(apiResponseError)
    if (!apiResponseError.response || !apiResponseError.response.data) {
        throw new UnexpectedError('Unexpected error occurred');
    }

    const responseObj = apiResponseError.response.data;
    const keys = Object.keys(responseObj);
    let message = '';
    let data = '';

    if (keys.length === 1) {
        const key = keys[0];
        message = apiErrors[responseObj[key]] || responseObj[key];
    } else if (keys.length > 1) {
        const messageKey = keys.find(key => key === 'message') || keys[0];
        message = apiErrors[responseObj[messageKey]] || responseObj[messageKey];
        const dataKey = keys.find(key => key !== 'message');
        if (dataKey) {
            data = responseObj[dataKey];
        }
    }

    const [_, errorType] = message.split('.');
    throw errorFactory(errorType, message, data);
};