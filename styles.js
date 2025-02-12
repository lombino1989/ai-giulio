// Configurazione API Stability
const STABILITY_API_KEY = 'sk-1Yw27y4YsUVbqFtDTRVlQmeH6jkXdbBLz1Y6wxUSZoefy1bd';
const API_HOST = 'https://api.stability.ai';

// Elementi DOM
const elements = {
    promptInput: document.getElementById('promptInput'),
    generateBtn: document.getElementById('generateBtn'),
    resultsGallery: document.getElementById('resultsGallery'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    artType: document.getElementById('artType')
};

// Configurazione generazione immagini
const config = {
    portrait: {
        width: 1024,
        height: 1536
    },
    landscape: {
        width: 1536,
        height: 1024
    }
};

// Event Listeners
elements.generateBtn.addEventListener('click', handleGenerate);

// Gestione generazione arte
async function handleGenerate() {
    if (!validateInput()) return;
    
    try {
        showLoading();
        const imageData = await generateImage();
        displayResults(imageData.artifacts);
    } catch (error) {
        handleError(error);
    } finally {
        hideLoading();
    }
}

// Validazione input
function validateInput() {
    if (!elements.promptInput.value.trim()) {
        alert('Per favore, inserisci una descrizione per l\'immagine');
        return false;
    }
    return true;
}

// Generazione immagine
async function generateImage() {
    const dimensions = getDimensions();
    
    const response = await fetch(
        `${API_HOST}/v1/generation/stable-diffusion-xl-turbo/text-to-image`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${STABILITY_API_KEY}`,
            },
            body: JSON.stringify({
                text_prompts: [
                    {
                        text: elements.promptInput.value,
                        weight: 1,
                    }
                ],
                cfg_scale: 7.5,
                height: dimensions.height,
                width: dimensions.width,
                steps: 50,
                samples: 1,
                style_preset: "enhance",
                image_strength: 0.9,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
    }

    return response.json();
}

// Ottieni dimensioni in base al tipo selezionato
function getDimensions() {
    return config[elements.artType.value];
}

// Visualizza risultati
function displayResults(artifacts) {
    artifacts.forEach(image => {
        const container = createImageContainer(image);
        elements.resultsGallery.insertBefore(container, elements.resultsGallery.firstChild);
    });
}

// Crea container immagine
function createImageContainer(image) {
    const container = document.createElement('div');
    container.className = 'image-container';

    const img = document.createElement('img');
    img.src = `data:image/png;base64,${image.base64}`;
    img.alt = 'Arte Generata';
    img.className = 'generated-image';

    container.appendChild(img);
    return container;
}

// Gestione errori
function handleError(error) {
    console.error('Errore:', error);
    alert('Si è verificato un errore durante la generazione dell\'immagine. Per favore riprova.');
}

// Gestione loading
function showLoading() {
    elements.loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    elements.loadingOverlay.classList.add('hidden');
}