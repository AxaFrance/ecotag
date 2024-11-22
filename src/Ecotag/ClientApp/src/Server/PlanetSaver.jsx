import React, { useState, useEffect } from 'react';
import BaseUrlContext from './BaseUrlContext';
import SlimFaasPlanetSaver from "./SlimFaasPlanetSaver.js";

const PlanetSaver = ({ children, baseUrl }) => {
    const [isFirstStart, setIsFirstStart] = useState(true); // État pour le premier démarrage

    useEffect(() => {
        if (!baseUrl) return;

        const environmentStarter = new SlimFaasPlanetSaver(baseUrl, {
            updateCallback: (data) => {
                const allReady = data.every((item) => item.NumberReady >= 1);
                if (allReady && isFirstStart) {
                    setIsFirstStart(false);
                }
            },
            errorCallback: (error) => {
                console.error('Erreur détectée :', error);
                environmentStarter.updateOverlayMessage('An error occured when starting environment. Please contact an administrator.');
            },
            overlayMessage: 'Starting the environment...',
        });

        // Démarrage de la surveillance
        environmentStarter.startPolling();

        // Nettoyage lors du démontage
        return () => environmentStarter.cleanup();
    }, [baseUrl, isFirstStart]);
    
    // Pendant le premier démarrage, rien n'est affiché
    if (isFirstStart) {
        return null;
    }

    // Une fois le premier démarrage terminé, afficher les enfants
    return <>{children}</>;

};

export default PlanetSaver;
