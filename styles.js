// Configuration for Stability AI
const config = {
    apiKey: 'sk-1Yw27y4YsUVbqFtDTRVlQmeH6jkXdbBLz1Y6wxUSZoefy1bd',
    apiEndpoint: 'https://api.stability.ai/v1/generation/stable-diffusion-v1-5/text-to-image',
};

// DOM Elements
const elements = {
    promptInput: document.getElementById('promptInput'),
    stylePreset: document.getElementById('stylePreset'),
    generateBtn: document.getElementById('generateBtn'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    resultsGallery: document.getElementById('resultsGallery'),
};

// State management
let isGenerating = false;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('App initialized');
    elements.generateBtn.addEventListener('click', handleGeneration);
});

async function handleGeneration() {
    if (isGenerating) return;
    
    const prompt = elements.promptInput.value.trim();
    if (!prompt) {
        alert('Per favore, inserisci una descrizione per la tua arte.');
        return;
    }

    try {
        isGenerating = true;
        elements.loadingOverlay.classList.remove('hidden');
        elements.generateBtn.disabled = true;

        const response = await fetch(config.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`,
            },
            body: JSON.stringify({
                text_prompts: [{
                    text: prompt
                }],
                cfg_scale: 7,
                clip_guidance_preset: 'FAST_BLUE',
                height: 512,
                width: 512,
                samples: 1,
                steps: 30
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Errore durante la generazione');
        }

        const result = await response.json();
        console.log('API Response:', result);

        if (result.artifacts && result.artifacts.length > 0) {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';

            const img = document.createElement('img');
            img.src = `data:image/png;base64,${result.artifacts[0].base64}`;
            img.alt = 'Generated artwork';
            img.className = 'result-image';

            imageContainer.appendChild(img);
            elements.resultsGallery.innerHTML = '';
            elements.resultsGallery.appendChild(imageContainer);

            // Add download button
            const downloadBtn = document.createElement('button');
            downloadBtn.textContent = 'Scarica Immagine';
            downloadBtn.className = 'download-btn';
            downloadBtn.onclick = () => downloadImage(img.src);
            imageContainer.appendChild(downloadBtn);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Si è verificato un errore durante la generazione dell\'immagine');
    } finally {
        isGenerating = false;
        elements.loadingOverlay.classList.add('hidden');
        elements.generateBtn.disabled = false;
    }
}

function downloadImage(dataUrl) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `ai-artwork-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Add some example prompts
const examplePrompts = [
    "un tramonto sulla spiaggia",
    "un gatto che dorme su un cuscino",
    "un paesaggio di montagna",
    "un ritratto in stile rinascimentale"
];

// Update placeholder with random prompt
function updatePlaceholder() {
    const randomPrompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    elements.promptInput.placeholder = `Esempio: ${randomPrompt}`;
}

updatePlaceholder();
setInterval(updatePlaceholder, 5000);