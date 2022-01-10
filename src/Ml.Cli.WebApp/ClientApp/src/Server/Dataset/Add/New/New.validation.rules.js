import { NAME, TYPE, FILES, CLASSIFICATION, MSG_REQUIRED } from './constants';

const rulesRequired = {
  required: {
    message: MSG_REQUIRED,
  },
};

export const rules = {
  [NAME]: [rulesRequired],
  [TYPE]: [rulesRequired],
  [CLASSIFICATION]: [rulesRequired],
};
