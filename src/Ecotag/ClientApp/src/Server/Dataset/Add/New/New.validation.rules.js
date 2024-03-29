import {
    CLASSIFICATION,
    DATASETS_IMPORT,
    GROUP,
    IMPORTED_DATASET_NAME,
    MSG_DATASET_NAME_FORMAT,
    MSG_MAX_LENGTH,
    MSG_MIN_LENGTH,
    MSG_REQUIRED,
    NAME,
    TYPE
} from './constants';

export const rulesRequired = {
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
        message: MSG_DATASET_NAME_FORMAT
    }
}

export const rules = {
    [NAME]: [rulesRequired, rulesMinLength, rulesMaxLength, rulesRegex],
    [GROUP]: [rulesRequired],
    [TYPE]: [rulesRequired],
    [CLASSIFICATION]: [rulesRequired],
    [DATASETS_IMPORT]: [],
    [IMPORTED_DATASET_NAME]: []
};
