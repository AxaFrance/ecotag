import Validate from 'mw.validation';

const computeProperty = (rules, state, propertyName) => {
  let updatedState = { ...state };
  const input = state[propertyName];
  if (input && input instanceof Object) {
    const event = {
      name: propertyName,
      value: input.value,
      viewValue: input.viewValue,
      values: input.values,
    };
    updatedState = genericHandleChange(rules, state, event);
  }
  return updatedState;
};

export const computeInitialStateErrorMessage = (state, rules) => {
  for (const propertyName in rules) {
    if (Object.prototype.hasOwnProperty.call(rules, propertyName)) {
      state = computeProperty(rules, state, propertyName);
    }
  }
  return state;
};

export const validate = (rules, value) => {
  const validationResult = Validate.validation.firstError(Validate.validation.validateView(value, rules));

  return validationResult != null ? validationResult.message : null;
};

export const genericHandleChange = (rules, state, event) => {
  if (rules[event.name]) {
    if (event.values !== undefined) {
      // Le cas d'un champ qui possède des valeurs multiple avec un required
      const { values } = event;
      const errorMessage = values === null || values === undefined ? rules[event.name][0].required.message : null;
      return {
        ...state,
        [event.name]: {
          ...state[event.name],
          message: errorMessage,
          values,
        },
      };
    }

    if (event.viewValue !== undefined) {
      // Le cas d'un date par exemple on valide du text et non un objet date
      const { viewValue, value } = event;
      const inputRules = rules[event.name];
      const message = validate(inputRules, viewValue);
      return {
        ...state,
        [event.name]: {
          ...state[event.name],
          value,
          viewValue,
          message,
        },
      };
    }

    // le cas le plus répandu, on valide une "value" simple
    const { value } = event;
    const inputRules = rules[event.name];
    const message = validate(inputRules, value);
    return {
      ...state,
      [event.name]: {
        ...state[event.name],
        value,
        message,
      },
    };
  }
  console.warn(`Attention le champ ${event.name} n'est pas traité`);
  return state;
};
