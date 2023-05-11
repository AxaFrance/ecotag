import React from 'react';
import logo from '@axa-fr/react-toolkit-core/dist/assets/logo-axa.svg';
import {Footer} from '@axa-fr/react-toolkit-all';
import './Footer.scss';
import useProjectTranslation from "../../../useProjectTranslation";

const FooterApp = () => {
    const {translate} = useProjectTranslation();
    const copyright =
        translate('shared.footer.copyright_trademark') + ' ' + new Date().getFullYear() + ' ' + translate('shared.footer.copyright');
    return(
        <Footer icon={logo} copyright={copyright}/>
    );
}

export default FooterApp;
