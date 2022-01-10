import { rules } from './New/New.validation.rules';
import { computeInitialStateErrorMessage, genericHandleChange } from '../../validation.generic';
import { NAME, MSG_REQUIRED } from './New/constants';
import {resilienceStatus} from "../../shared/Resilience";

export const initialState = {
  status: resilienceStatus.LOADING,
  items: [],
  filters: {
    paging: {
      numberItemsByPage: 10,
      currentPage: 1,
    },
  },
  hasSubmit: false,
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
      const { groups, users, status } = action.data;
      groups.forEach(group => (group.eligibleUsers = computeEligibleUsers(group.users, users)));
      return {
        ...state,
        status,
        items : groups,
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
      return {
        ...state,
        fields: newField,
      };
    }
    case 'onActionGroupLoading': {
      return {
        ...state,
        status: resilienceStatus.LOADING,
      };
    }
    case 'onSubmitCreateGroup': {
      return {
        ...state,
        hasSubmit: true,
        status: resilienceStatus.SUCCESS,
      };
    }
    case 'changeUserLoading': {
        return {
          ...state,
          status : resilienceStatus.LOADING,
        };
    }
    case 'changeUserEnded': {
      const { status, updatedGroup } = action.data;

      if(status === resilienceStatus.ERROR){
        return {
          ...state,
          status,
        };
      }
      const items = [...state.items];
      const item = items.find(i => i.id === updatedGroup.id);
      if(item) {
        const index = items.indexOf(item);
        if (index > -1) {
          items.splice(index, 1);
          items.splice(index, 0, updatedGroup)
        }
      }

      return {
        ...state,
        status,
        items,
      };
    }
    default:
      throw new Error();
  }
};
