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

export const rules = {
  [NAME]: [rulesRequired, rulesMinLength],
};
