// Configurazione API
const API_KEY = 'sk-1Yw27y4YsUVbqFtDTRVlQmeH6jkXdbBLz1Y6wxUSZoefy1bd';
const API_URL = 'https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image';

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

        // Aggiungi stile anime al prompt
        const animePrompt = `${prompt}, anime style, manga style, detailed anime illustration, high quality anime art, Studio Ghibli style, vibrant colors`;

        // Prepara i dati per la richiesta
        const requestData = {
            text_prompts: [
                { text: animePrompt, weight: 1 },
                { text: "western style, photorealistic, 3d rendering", weight: -1 }
            ],
            cfg_scale: 7,
            height: dimensions.height,
            width: dimensions.width,
            steps: 30,
            samples: 1,
            style_preset: "anime"
        };

        console.log('Invio richiesta:', requestData);

        // Chiamata API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Errore API: ${response.status} - ${errorData.message || 'Errore sconosciuto'}`);
        }

        const result = await response.json();
        
        if (result.artifacts && result.artifacts.length > 0) {
            // Crea elemento immagine e container
            const container = document.createElement('div');
            container.className = 'image-container';

            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'image-wrapper';

            const img = document.createElement('img');
            img.src = `data:image/png;base64,${result.artifacts[0].base64}`;
            img.className = 'generated-image';
            img.alt = 'Immagine Generata';

            // Aggiungi pulsante download
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-button';
            downloadBtn.innerHTML = '⬇️ Scarica';
            downloadBtn.onclick = () => downloadImage(result.artifacts[0].base64, 'anime_art.png');

            imgWrapper.appendChild(img);
            container.appendChild(imgWrapper);
            container.appendChild(downloadBtn);
            resultsGallery.insertBefore(container, resultsGallery.firstChild);
        }

    } catch (error) {
        console.error('Errore:', error);
        alert(`Errore durante la generazione dell'immagine: ${error.message}`);
    } finally {
        loadingOverlay.classList.add('hidden');
    }
});

// Funzione per scaricare l'immagine
function downloadImage(base64Data, fileName) {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${base64Data}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}