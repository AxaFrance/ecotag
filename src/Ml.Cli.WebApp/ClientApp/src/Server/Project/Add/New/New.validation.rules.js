import { NAME, DATASET, NUMBER_CROSS_ANNOTATION, TYPE, MSG_REQUIRED, LABELS, CLASSIFICATION, GROUP } from './constants';

const rulesRequired = {
  required: {
    message: MSG_REQUIRED,
  },
};

const rulesMaxLength = max => ({
  maxLength: {
    maxLength: max,
    message: 'Le champ contient trop de caractères',
  },
});

const ruleNumber = {
  pattern: {
    regex: /^[0-9]*$/,
    message: 'Veuillez saisir un nombre',
  },
};

export const rules = {
  [NAME]: [rulesRequired],
  [DATASET]: [],
  [TYPE]: [rulesRequired],
  [LABELS]: [],
  [NUMBER_CROSS_ANNOTATION]: [rulesMaxLength(10), ruleNumber],
  [CLASSIFICATION]: [rulesRequired],
  [GROUP]: [rulesRequired],
};
