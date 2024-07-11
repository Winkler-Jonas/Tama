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