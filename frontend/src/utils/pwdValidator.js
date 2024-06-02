// src/utils/pwdValidator.js

const userAttributeSimilarityValidator = (password, username) => {
    const lowerPassword = password.toLowerCase();
    const lowerUsername = username.toLowerCase();

    if (lowerPassword && lowerUsername && lowerPassword.includes(lowerUsername)) {
        return 'error.pass.similar';
    }
    return '';
};

const minimumLengthValidator = (password, minLength = 8) => {
    if (password.length < minLength) {
        return `error.pass.short`;
    }
    return '';
};

const numericPasswordValidator = (password) => {
    if (/^\d+$/.test(password)) {
        return 'error.pass.numeric';
    }
    return '';
};

const matchingValidator = (pass1, pass2) => {
    return pass1 === pass2 ? '' : 'error.pass.noMatch'
}

export const validatePassword = (password, username = '', password2 = '') => {
    const validators = [
        userAttributeSimilarityValidator(password, username),
        minimumLengthValidator(password),
        numericPasswordValidator(password)
    ];
    if (password2) {
        validators.push(matchingValidator(password, password2));
    }

    const error = validators.find((msg) => msg !== '');
    return error || '';
};
