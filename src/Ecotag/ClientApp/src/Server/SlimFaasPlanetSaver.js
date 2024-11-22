
export default class SlimFaasPlanetSaver {
    constructor(baseUrl, options = {}) {
        this.baseUrl = this.normalizeBaseUrl(baseUrl);
        this.updateCallback = options.updateCallback || (() => {});
        this.errorCallback = options.errorCallback || (() => {});
        this.interval = options.interval || 5000;
        this.overlayMessage = options.overlayMessage || 'Starting in progress...';
        this.intervalId = null;
        this.isDocumentVisible = !document.hidden;
        this.overlayElement = null;
        this.styleElement = null;
        this.isReady = false;
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        document.addEventListener('visibilitychange', this.handleVisibilityChange);

        // Initialise le calque et le style
        this.createOverlay();
        this.injectStyles();

        // Événements personnalisés
        this.events = document.createElement('div'); // Utilisé comme bus d'événements
    }

    // Normalise l'URL de base
    normalizeBaseUrl(url) {
        let tempUrl = url;
        if (tempUrl.endsWith('/')) tempUrl = tempUrl.slice(0, -1);
        return tempUrl;
    }

    // Gestion de la visibilité du document
    handleVisibilityChange() {
        this.isDocumentVisible = !document.hidden;
        if (this.isDocumentVisible) {
            this.startPolling();
        } else {
            this.stopPolling();
        }
    }

    async wakeUpPods(data) {
        const wakePromises = data
            .filter((item) => item.NumberReady === 0)
            .map((item) =>
                fetch(`${this.baseUrl}/wake-function/${item.Name}`, {
                    method: 'POST',
                })
            );

        try {
            await Promise.all(wakePromises);
        } catch (error) {
            console.error("Erreur lors du réveil des pods:", error);
        }
    }

    // Récupère le statut de l'infrastructure
    async fetchStatus() {
        if (!this.isDocumentVisible) return;

        try {
            const response = await fetch(`${this.baseUrl}/status-functions`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            const allReady = data.every((item) => item.NumberReady >= 1);
            this.setReadyState(allReady);

            this.updateCallback(data);
            await this.wakeUpPods(data);
        } catch (error) {
            const errorMessage = error.message;
            this.errorCallback(errorMessage);

            // Déclenche un événement "error"
            this.triggerEvent('error', { message: errorMessage });

            console.error('Erreur lors de la récupération des données :', errorMessage);
        }
    }

    // Définit l'état "ready" et gère le calque
    setReadyState(isReady) {
        this.isReady = isReady;
        if (isReady) {
            this.hideOverlay();
        } else {
            this.showOverlay();
        }
    }

    // Démarre la surveillance (polling)
    startPolling() {
        if (this.intervalId || !this.baseUrl) return;

        this.fetchStatus();

        this.intervalId = setInterval(() => {
            this.fetchStatus();
        }, this.interval);
    }

    // Arrête la surveillance
    stopPolling() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    // Injecte les styles CSS via un élément <style>
    injectStyles() {
        const cssString = `
      .environment-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 1.5rem;
        font-weight: bold;
        z-index: 1000;
        visibility: hidden;
      }

      .environment-overlay.visible {
        visibility: visible;
      }
    `;

        this.styleElement = document.createElement('style');
        this.styleElement.textContent = cssString;
        document.head.appendChild(this.styleElement);
    }

    // Crée un calque pour le message d'attente
    createOverlay() {
        this.overlayElement = document.createElement('div');
        this.overlayElement.className = 'environment-overlay';
        this.overlayElement.innerText = this.overlayMessage;
        document.body.appendChild(this.overlayElement);
    }

    // Affiche le calque
    showOverlay() {
        if (this.overlayElement) {
            this.overlayElement.classList.add('visible');
        }
    }

    // Cache le calque
    hideOverlay() {
        if (this.overlayElement) {
            this.overlayElement.classList.remove('visible');
        }
    }

    // Met à jour dynamiquement le message de l'overlay
    updateOverlayMessage(newMessage) {
        if (this.overlayElement) {
            this.overlayElement.innerText = newMessage;
        }
    }

    // Déclenche un événement personnalisé
    triggerEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        this.events.dispatchEvent(event);
    }
    
    // Nettoyage des ressources
    cleanup() {
        this.stopPolling();
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        if (this.overlayElement) {
            document.body.removeChild(this.overlayElement);
        }
        if (this.styleElement) {
            document.head.removeChild(this.styleElement);
        }
    }
}
