import compose from './compose';
import { withEnvironment } from './EnvironmentProvider';
import {withOidcFetch} from '@axa-fr/react-oidc';
import React from 'react';

const FETCH_CONFIG = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
  },
  withCredentials: true,
};

const customFetch = fetch => apiBaseUrl => async (path, config) => {
  const url = apiBaseUrl.replace('{path}', path);
  const response = await fetch(url, { ...FETCH_CONFIG, ...config });
  if (response.status === 204) {
    return [];
  }
  return response;
};

const withCustomFetch = Component => ({ environment, ...otherProps }) => (
  <Component {...otherProps} fetch={customFetch(otherProps.fetch)(environment.apiUrl)} />
);

export default (fetch = undefined) => compose(withEnvironment, withOidcFetch(fetch), withCustomFetch);
