// Configurazione API
const API_KEY = 'sk-1Yw27y4YsUVbqFtDTRVlQmeH6jkXdbBLz1Y6wxUSZoefy1bd';
const API_URL = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';

// Elementi DOM
const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const resultsGallery = document.getElementById('resultsGallery');
const loadingOverlay = document.getElementById('loadingOverlay');

// Event Listener
generateBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    
    if (!prompt) {
        alert('Per favore, inserisci una descrizione');
        return;
    }

    try {
        loadingOverlay.classList.remove('hidden');
        
        const requestData = {
            text_prompts: [{
                text: `${prompt}, Mediterranean oil painting style, vintage Italian postcard, coastal scene, vibrant colors, detailed brushstrokes, artistic composition`,
                weight: 1
            }],
            cfg_scale: 7,
            height: 1024,
            width: 1024,
            samples: 1,
            steps: 40
        };

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
            throw new Error(`Errore API: ${errorData.message || response.statusText}`);
        }

        const result = await response.json();
        
        if (!result.artifacts || result.artifacts.length === 0) {
            throw new Error('Nessuna immagine generata');
        }

        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';
        
        const img = document.createElement('img');
        img.src = `data:image/png;base64,${result.artifacts[0].base64}`;
        img.alt = prompt;
        
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Scarica';
        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.href = img.src;
            link.download = 'immagine-generata.png';
            link.click();
        };
        
        imageContainer.appendChild(img);
        imageContainer.appendChild(downloadBtn);
        resultsGallery.insertBefore(imageContainer, resultsGallery.firstChild);

    } catch (error) {
        console.error('Errore:', error);
        alert(`Errore durante la generazione: ${error.message}`);
    } finally {
        loadingOverlay.classList.add('hidden');
    }
});