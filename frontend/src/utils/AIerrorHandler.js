/*
* This file is part of Project-Tamado.
*
* Copyright (c) 2024 Jonas Winkler
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
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
