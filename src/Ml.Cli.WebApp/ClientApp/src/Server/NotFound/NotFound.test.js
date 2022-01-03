import React from 'react';
import NotFound from './NotFound.component';
import {render} from "@testing-library/react";

describe('NotFound', () => {
  it('1. Renders NotFound page component without crashing', () => {
    const {asFragment} = render(<NotFound/>);
    expect(asFragment()).toMatchSnapshot();
  });
});
