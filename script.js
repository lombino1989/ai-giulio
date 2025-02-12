// Configurazione API
const API_KEY = 'sk-1Yw27y4YsUVbqFtDTRVlQmeH6jkXdbBLz1Y6wxUSZoefy1bd';
const API_URL = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';

// Elementi DOM
const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const resultsGallery = document.getElementById('resultsGallery');
const loadingOverlay = document.getElementById('loadingOverlay');
const artType = document.getElementById('artType');

// Event Listener
generateBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    
    if (!prompt) {
        alert('Per favore, inserisci una descrizione');
        return;
    }

    try {
        // Mostra loading
        loadingOverlay.classList.remove('hidden');

        // Imposta dimensioni
        const dimensions = artType.value === 'portrait' 
            ? { width: 768, height: 1024 }
            : { width: 1024, height: 768 };

        // Chiamata API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                text_prompts: [{ text: prompt, weight: 1 }],
                cfg_scale: 7,
                height: dimensions.height,
                width: dimensions.width,
                steps: 30,
                samples: 1
            })
        });

        // Gestione risposta
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.artifacts && result.artifacts.length > 0) {
            // Crea elemento immagine
            const container = document.createElement('div');
            container.className = 'image-container';

            const img = document.createElement('img');
            img.src = `data:image/png;base64,${result.artifacts[0].base64}`;
            img.className = 'generated-image';
            img.alt = 'Immagine Generata';

            container.appendChild(img);
            resultsGallery.insertBefore(container, resultsGallery.firstChild);
        }

    } catch (error) {
        console.error('Errore:', error);
        alert('Errore durante la generazione dell\'immagine. Riprova.');
    } finally {
        // Nascondi loading
        loadingOverlay.classList.add('hidden');
    }
});