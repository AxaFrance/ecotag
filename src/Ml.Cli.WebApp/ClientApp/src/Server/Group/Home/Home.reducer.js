import { rules } from './New/New.validation.rules';
import { computeInitialStateErrorMessage, genericHandleChange } from '../../validation.generic';
import { NAME, MSG_REQUIRED } from './New/constants';

export const initialState = {
  loading: true,
  items: [],
  filters: {
    paging: {
      numberItemsByPage: 10,
      currentPage: 1,
    },
  },
  hasSubmit: false,
  isSubmitable: false,
  fields: {
    [NAME]: { name: NAME, value: '', message: MSG_REQUIRED },
  },
};

export const initState = computeInitialStateErrorMessage(initialState, rules);

const NOT_FOUND = -1;
const computeEligibleUsers = (actualUsers = [], allEligibleUsers = []) => {
  const emails = actualUsers.map(user => user.email);
  return allEligibleUsers.filter(user => emails.indexOf(user.email) === NOT_FOUND);
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'init': {
      const { items, eligibleUsers } = action.data;
      items.forEach(group => (group.eligibleUsers = computeEligibleUsers(group.users, eligibleUsers)));
      return {
        ...state,
        loading: false,
        items,
      };
    }
    case 'onChangePaging': {
      const { numberItems, page } = action.data;
      return {
        ...state,
        filters: {
          ...state.filters,
          paging: {
            numberItemsByPage: numberItems,
            currentPage: page,
          },
        },
      };
    }
    case 'onChangeCreateGroup': {
      const newField = genericHandleChange(rules, state.fields, action.event);
      const hasErrors = newField[NAME].message === null;
      return {
        ...state,
        fields: newField,
        isSubmitable: hasErrors,
      };
    }
    case 'onActionGroupLoading': {
      return {
        ...state,
        loading: true,
      };
    }
    case 'onSubmitCreateGroup': {
      return {
        ...state,
        hasSubmit: true,
        loading: false,
        isSubmitable: false,
      };
    }
    case 'changeUserLoading': {
      const { loading } = action.data;
      return {
        ...state,
        loading,
      };
    }
    default:
      throw new Error();
  }
};
