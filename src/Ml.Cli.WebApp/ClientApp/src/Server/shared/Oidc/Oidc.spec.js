import React from "react";
import '@testing-library/jest-dom';
import {render} from '@testing-library/react';
import AuthenticatingError from "./AuthenticateError.component";
import Authenticating from "./Authenticating.component";
import {CallBackSuccess} from "./Callback.component";
import Loading from "./Loading.component";
import ServiceWorkerNotSupported from "./ServiceWorkerNotSupported.component";
import SessionLost from "./SessionLost.component";

describe('Oidc', () => {
   /* test('Render AuthenticatingError component', async () => {
        const { asFragment } = render(<AuthenticatingError />);
        expect(asFragment()).toMatchSnapshot();
    });*/

    test('Render Authenticating component', async () => {
        const { asFragment } = render(<Authenticating />);
        expect(asFragment()).toMatchSnapshot();
    });

    test('Render CallBackSuccess component', async () => {
        const { asFragment } = render(<CallBackSuccess />);
        expect(asFragment()).toMatchSnapshot();
    });

    test('Render Loading component', async () => {
        const { asFragment } = render(<Loading />);
        expect(asFragment()).toMatchSnapshot();
    });

    test('Render ServiceWorkerNotSupported component', async () => {
        const { asFragment } = render(<ServiceWorkerNotSupported />);
        expect(asFragment()).toMatchSnapshot();
    });

    /*test('Render SessionLost component', async () => {
        const { asFragment } = render(<SessionLost />);
        expect(asFragment()).toMatchSnapshot();
    });*/
});
