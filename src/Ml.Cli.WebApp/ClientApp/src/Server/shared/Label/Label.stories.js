import React from "react";
import LabelContainer from './Label';
import {storiesOf} from "@storybook/react";
import LabelInput from "./LabelInput";


const currentLabels = [{name: "recto", id: 1, color: "#212121"}];

const onChange = e => {
    console.log(e)
};

storiesOf('shared/Label/Label component', module).add('Label simple', () => <LabelContainer name="recto" id="1" values={currentLabels} onChange={onChange}/>)
    .add('label Input', () => <LabelInput forceDisplayMessage={true} message={"message d'erreur type"} label="Ajouter des labels :" name="recto" id="1" values={currentLabels} onChange={onChange}/>)

