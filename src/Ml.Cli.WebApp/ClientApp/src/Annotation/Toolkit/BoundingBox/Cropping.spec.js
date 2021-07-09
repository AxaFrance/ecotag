/*
model de donnée de sortie
positif
n'exéde pas l'image
vérifier que top left de sortie soit bien le point visible en haut à gauche
si rectangle width < 5px et heigth 5 <px
BUG a la création différent du resize
BUG sortie du cadre en haut et a gauche, composant devrait se supprimer
 */

import '@testing-library/jest-dom';
import {render, fireEvent, screen, waitFor} from '@testing-library/react';
import React from "react";

describe(`Annotation.Cropping`, () => {
    test(`output should have correct values`, async () => {

        const badValues = {
            "width":1653,
            "height":2339,
            "type":"png",
            "label":{
                "boundingBoxes":[{
                    "height":626,
                    "label":"TEST1",
                    "left":834,
                    "top":464,
                    "width":819},{
                    "height":623,
                    "label":"TEST",
                    "left":0,
                    "top":211,
                    "width":352}],
                }};




    });
});
