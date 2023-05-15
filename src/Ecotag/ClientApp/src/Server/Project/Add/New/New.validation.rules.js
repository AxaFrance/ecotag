import {
    DATASET,
    GROUP,
    LABELS,
    MSG_REQUIRED,
    MSG_RULE_NUMBER,
    MSG_TEXT_REGEX,
    NAME,
    NUMBER_CROSS_ANNOTATION,
    TYPE
} from './constants';

const rulesRequired = {
    required: {
        message: MSG_REQUIRED,
    },
};

const rulesMaxLength = max => ({
    maxLength: {
        maxLength: max
    },
});

const rulesMinLength = min => ({
    minLength: {
        minLength: min
    }
});

const ruleText = {
    pattern: {
        regex: /^[a-zA-Z0-9-_]*$/,
        message: MSG_TEXT_REGEX
    }
}

const ruleNumber = {
    pattern: {
        regex: /^([1-9]|10)$/,
        message: MSG_RULE_NUMBER,
    },
};

export const rules = {
    [NAME]: [rulesRequired, rulesMaxLength(48), rulesMinLength(3), ruleText],
    [DATASET]: [rulesRequired],
    [TYPE]: [rulesRequired],
    [LABELS]: [],
    [NUMBER_CROSS_ANNOTATION]: [ruleNumber],
    [GROUP]: [rulesRequired],
};
