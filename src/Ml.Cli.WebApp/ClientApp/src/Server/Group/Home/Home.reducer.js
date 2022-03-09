import { rules } from './New/New.validation.rules';
import { computeInitialStateErrorMessage, genericHandleChange } from '../../validation.generic';
import {NAME, MSG_REQUIRED, MSG_GROUP_NAME_ALREADY_EXIST} from './New/constants';
import {resilienceStatus} from "../../shared/Resilience";

export const initialState = {
  status: resilienceStatus.LOADING,
  groups: [],
  users: [],
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


export const reducer = (state, action) => {
  switch (action.type) {
    case 'init': {
      const { groups, users, status } = action.data;
      return {
        ...state,
        status,
        groups,
        users
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
      const newGroupName = action.event.value;
      const newField = genericHandleChange(rules, state.fields, action.event);
      if(newField[NAME].message.includes("format")){
        newField[NAME].message += " (Lettres, - ou _)";
        return {
          ...state,
          fields: newField
        }
      }
      if(state.groups.find(group => group.name === newGroupName)){
        newField[NAME].message = MSG_GROUP_NAME_ALREADY_EXIST
        return {
          ...state,
          fields: newField
        }
      }
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
      const{status, newGroup} = action.data;

      if(status === resilienceStatus.ERROR){
        return {
          ...state,
          status,
        };
      }

      let groups = [...state.groups];
      if(state.groups.filter(group => group.name === newGroup.name).length === 0){
        groups = [...state.groups, newGroup];
      }
      
      return {
        ...state,
        hasSubmit: true,
        fields: {
          [NAME]: { name: NAME, value: '', message: "" },
        },
        status: resilienceStatus.SUCCESS,
        groups
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
      const groups = [...state.groups];
      const item = groups.find(i => i.id === updatedGroup.id);
      if(item) {
        const index = groups.indexOf(item);
        if (index > -1) {
          groups.splice(index, 1);
          groups.splice(index, 0, updatedGroup)
        }
      }

      return {
        ...state,
        status,
        groups,
      };
    }
    default:
      throw new Error();
  }
};
