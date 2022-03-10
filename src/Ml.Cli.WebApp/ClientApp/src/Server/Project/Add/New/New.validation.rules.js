
import { NAME, DATASET, NUMBER_CROSS_ANNOTATION, TYPE, MSG_REQUIRED, LABELS, GROUP } from './constants';

const rulesRequired = {
  required: {
    message: MSG_REQUIRED,
  },
};

const rulesMaxLength = max => ({
  maxLength: {
    maxLength: max,
    message: 'Veuillez saisir au plus ' + max + " caractères)",
  },
});

const rulesMinLength = min => ({
  minLength: {
    minLength: min,
    message: 'Veuillez saisir au moins ' + min + " caractères)"
  }
});

const ruleText = {
  pattern: {
    regex: /^[a-zA-Z-_]*$/,
    message: "Veuillez respecter le bon format (Lettres, '-' ou '_' uniquement)"
  }
}

const ruleNumber = {
  pattern: {
    regex: /^([1-9]|10)$/,
    message: 'Veuillez saisir un nombre entier compris entre 1 et 10',
  },
};

export const rules = {
  [NAME]: [rulesRequired, rulesMaxLength(16), rulesMinLength(3), ruleText],
  [DATASET]: [rulesRequired],
  [TYPE]: [rulesRequired],
  [LABELS]: [],
  [NUMBER_CROSS_ANNOTATION]: [rulesMaxLength(10), ruleNumber],
  [GROUP]: [rulesRequired],
};
