import {NAME, MSG_REQUIRED, MSG_MIN_LENGTH, MSG_MAX_LENGTH} from './constants';

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
    maxLength: 16,
    message: MSG_MAX_LENGTH,
  },
};

const rulesRegex = {
  pattern: {
    regex: /^[a-zA-Z-_]*$/
  }
}

export const rules = {
  [NAME]: [rulesRequired, rulesMinLength, rulesMaxLength, rulesRegex],
};
