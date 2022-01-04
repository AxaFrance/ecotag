import React from "react";
import LabelContainer from './Label';
import LabelInput from "./LabelInput";

const currentLabels = [{name: "recto", id: 1, color: "#212121"}];

const onChange = e => {
    console.log(e);
};

export default {
    title: 'shared/Label/Label component'
};

export const LabelSimple = () => <LabelContainer name="recto" id="1" values={currentLabels} onChange={onChange}/>;

export const LabelWithInput = () => <LabelInput forceDisplayMessage={true} message={"message d'erreur type"} label="Ajouter des labels :" name="recto" id="1" values={currentLabels} onChange={onChange}/>;

