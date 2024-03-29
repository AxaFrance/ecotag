import {MSG_MAX_LENGTH, MSG_MIN_LENGTH, MSG_REGEX, MSG_REQUIRED, NAME} from './constants';

const rulesRequired = {
    required: {
        message: MSG_REQUIRED,
    },
};

const rulesMinLength = {
    minLength: {
        minLength: 3,
        message: MSG_MIN_LENGTH,
    },
};

const rulesMaxLength = {
    maxLength: {
        maxLength: 48,
        message: MSG_MAX_LENGTH,
    },
};

const rulesRegex = {
    pattern: {
        regex: /^[a-zA-Z0-9-_]*$/,
        message: MSG_REGEX
    },
}

export const rules = {
    [NAME]: [rulesRequired, rulesMinLength, rulesMaxLength, rulesRegex],
};
