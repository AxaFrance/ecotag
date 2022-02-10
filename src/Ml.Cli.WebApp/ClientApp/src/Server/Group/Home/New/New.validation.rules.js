import { NAME, MSG_REQUIRED } from './constants';

const rulesRequired = {
  required: {
    message: MSG_REQUIRED,
  },
};

const rulesMinLength = {
  minLength: {
    minLength: 3,
    message: 'Le champ ne contient pas assez de caractères (3 min)',
  },
};

const rulesMaxLength = {
  maxLength: {
    maxLength: 16,
    message: 'Le champ contient trop de caractères (16 max)',
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
