import React from "react";
import '@testing-library/jest-dom';
import {render} from '@testing-library/react';
import {AppHeader} from "./Header";

describe('Header', () => {
    test('Render header page', async () => {
        
        const user = {
            roles:["youhou", "youhou"],
            name: 'Guillaume Chervet'
        }
        const { asFragment, container  } = render(<AppHeader user={user} />);
        expect(asFragment()).toMatchSnapshot();
    });
});
