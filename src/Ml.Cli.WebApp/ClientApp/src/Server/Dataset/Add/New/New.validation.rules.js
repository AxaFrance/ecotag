
import { NAME, TYPE, GROUP, CLASSIFICATION, MSG_REQUIRED, MSG_MAX_LENGTH, MSG_MIN_LENGTH, MSG_DATASET_NAME_FORMAT } from './constants';

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
    regex: /^[a-zA-Z0-9-_]*$/,
    message: MSG_DATASET_NAME_FORMAT
  }
}

export const rules = {
  [NAME]: [rulesRequired, rulesMinLength, rulesMaxLength, rulesRegex],
  [GROUP]: [rulesRequired],
  [TYPE]: [rulesRequired],
  [CLASSIFICATION]: [rulesRequired],
};
