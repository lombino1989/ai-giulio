// Inizializzazione delle variabili
let imageCanvas, selectionCanvas;
let ctx, selectionCtx;
let isDrawing = false;
let lassoPoints = [];
let currentImage = null;

// Configurazione API
const API_KEY = 'sk-1Yw27y4YsUVbqFtDTRVlQmeH6jkXdbBLz1Y6wxUSZoefy1bd';
const API_ENDPOINT = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';

// Verifica che il DOM sia caricato
document.addEventListener('DOMContentLoaded', () => {
    // Elementi DOM
    const generateBtn = document.getElementById('generateBtn');
    const styleSelect = document.getElementById('styleSelect');
    const imageContainer = document.getElementById('imageContainer');
    const imageHistory = document.getElementById('imageHistory');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadContainer = document.getElementById('downloadContainer');

    // Verifica che tutti gli elementi siano stati trovati
    if (!generateBtn || !styleSelect || !imageContainer || !imageHistory || !loadingSpinner || !downloadBtn || !downloadContainer) {
        console.error('Elementi DOM mancanti:', {
            generateBtn: !!generateBtn,
            styleSelect: !!styleSelect,
            imageContainer: !!imageContainer,
            imageHistory: !!imageHistory,
            loadingSpinner: !!loadingSpinner,
            downloadBtn: !!downloadBtn,
            downloadContainer: !!downloadContainer
        });
        return;
    }

    // Stili predefiniti in inglese
    const styles = {
        coastal: {
            prompt: "impressionist painting of Mediterranean coast, large prickly pear cactus in foreground with ripe fruits, crystal clear blue sea, sunset sky with pink and purple clouds, stone house on cliff, detailed painterly style with visible brushstrokes, oil on canvas, artistic style, Mediterranean landscape",
            negative: "photography, low quality, blurry, digital art"
        },
        countryside: {
            prompt: "painting of Mediterranean countryside, ancient twisted olive trees in foreground, old stone walls, golden wheat field, colorful wildflowers, traditional house with tile roof in background, blue sky with white clouds, painterly style with pronounced texture, artistic style, Mediterranean landscape",
            negative: "photography, low quality, blurry, digital art"
        },
        harbor: {
            prompt: "painting of Mediterranean harbor, white lighthouse on rocky cliff, traditional colorful boat in foreground, bougainvillea flowers on old stone arch, calm turquoise sea, sunset sky with colored clouds, detailed Mediterranean painterly style, artistic style, Mediterranean landscape",
            negative: "photography, low quality, blurry, digital art"
        },
        village: {
            prompt: "painting of ancient Mediterranean village, stone stairway street, old arches with bougainvillea, prickly pear cactus on walls, sea view in distance, blue sky with fluffy clouds, detailed impressionist painterly style, artistic style, Mediterranean landscape",
            negative: "photography, low quality, blurry, digital art"
        }
    };

    // Array per memorizzare lo storico delle immagini
    let generatedImages = [];

    let currentImageData = null;

    // Funzione per generare un'immagine
    async function generateImage() {
        try {
            console.log('Inizio generazione immagine...');
            loadingSpinner.classList.remove('hidden');
            generateBtn.disabled = true;
            downloadContainer.classList.add('hidden');

            const selectedStyle = styles[styleSelect.value];
            console.log('Stile selezionato:', styleSelect.value);
            
            const requestBody = {
                text_prompts: [
                    {
                        text: selectedStyle.prompt,
                        weight: 1
                    },
                    {
                        text: selectedStyle.negative,
                        weight: -1
                    }
                ],
                cfg_scale: 8,
                height: 1024,
                width: 1024,
                samples: 1,
                steps: 50
            };

            console.log('Request body:', JSON.stringify(requestBody, null, 2));

            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify(requestBody)
            });

            console.log('Status risposta:', response.status);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Errore API: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            if (!result.artifacts || !result.artifacts[0] || !result.artifacts[0].base64) {
                throw new Error('Formato risposta API non valido');
            }

            currentImageData = result.artifacts[0].base64;
            
            // Mostra l'immagine generata
            displayNewImage(currentImageData);
            addToHistory(currentImageData);
            downloadContainer.classList.remove('hidden');

        } catch (error) {
            console.error('Errore dettagliato:', error);
            alert(`Errore durante la generazione dell'immagine: ${error.message}`);
        } finally {
            loadingSpinner.classList.add('hidden');
            generateBtn.disabled = false;
        }
    }

    // Funzione per mostrare la nuova immagine
    function displayNewImage(base64Data) {
        console.log('Mostro nuova immagine...');
        imageContainer.innerHTML = '';
        const img = document.createElement('img');
        img.src = `data:image/png;base64,${base64Data}`;
        imageContainer.appendChild(img);
    }

    // Funzione per aggiungere un'immagine allo storico
    function addToHistory(base64Data) {
        console.log('Aggiungo immagine allo storico...');
        const img = document.createElement('img');
        img.src = `data:image/png;base64,${base64Data}`;
        imageHistory.insertBefore(img, imageHistory.firstChild);
        
        // Aggiungi l'immagine all'inizio dello storico
        generatedImages.unshift(base64Data);
        if (generatedImages.length > 12) {
            generatedImages.pop();
            if (imageHistory.lastChild) {
                imageHistory.removeChild(imageHistory.lastChild);
            }
        }
    }

    function downloadImage() {
        if (!currentImageData) return;

        const link = document.createElement('a');
        link.href = `data:image/png;base64,${currentImageData}`;
        link.download = `dipinto-mediterraneo-${new Date().getTime()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Event listener per il pulsante di generazione
    generateBtn.addEventListener('click', generateImage);
    downloadBtn.addEventListener('click', downloadImage);
    console.log('Event listener aggiunto al pulsante genera');

    // Inizializzazione al caricamento della pagina
    setupCanvases();
    setupEventListeners();
});

function setupCanvases() {
    imageCanvas = document.getElementById('imageCanvas');
    selectionCanvas = document.getElementById('selectionCanvas');
    ctx = imageCanvas.getContext('2d');
    selectionCtx = selectionCanvas.getContext('2d');
    
    // Imposta dimensioni iniziali
    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);
}

function resizeCanvases() {
    const container = document.querySelector('.canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    [imageCanvas, selectionCanvas].forEach(canvas => {
        canvas.width = width;
        canvas.height = height;
    });
    
    if (currentImage) {
        drawImage(currentImage);
    }
}

function setupEventListeners() {
    const imageInput = document.getElementById('imageInput');
    const lassoTool = document.getElementById('lassoTool');
    const clearSelection = document.getElementById('clearSelection');
    
    imageInput.addEventListener('change', handleImageUpload);
    lassoTool.addEventListener('click', toggleLassoTool);
    clearSelection.addEventListener('click', clearLassoSelection);
    
    // Eventi per il disegno del lazo
    selectionCanvas.addEventListener('mousedown', startDrawing);
    selectionCanvas.addEventListener('mousemove', draw);
    selectionCanvas.addEventListener('mouseup', endDrawing);
    selectionCanvas.addEventListener('mouseleave', endDrawing);
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('Per favore seleziona un file immagine');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            currentImage = img;
            drawImage(img);
            console.log('Immagine caricata con successo');
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function drawImage(img) {
    const canvas = imageCanvas;
    const ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
    const width = img.width * ratio;
    const height = img.height * ratio;
    const x = (canvas.width - width) / 2;
    const y = (canvas.height - height) / 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, width, height);
}

function toggleLassoTool() {
    const lassoTool = document.getElementById('lassoTool');
    lassoTool.classList.toggle('active');
    selectionCanvas.style.cursor = lassoTool.classList.contains('active') ? 'crosshair' : 'default';
}

function startDrawing(e) {
    if (!document.getElementById('lassoTool').classList.contains('active')) return;
    
    isDrawing = true;
    lassoPoints = [];
    const rect = selectionCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    lassoPoints.push({x, y});
    
    selectionCtx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
    selectionCtx.beginPath();
    selectionCtx.moveTo(x, y);
    selectionCtx.strokeStyle = '#ff0000';
    selectionCtx.lineWidth = 2;
}

function draw(e) {
    if (!isDrawing) return;
    
    const rect = selectionCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    lassoPoints.push({x, y});
    
    selectionCtx.lineTo(x, y);
    selectionCtx.stroke();
}

function endDrawing() {
    if (!isDrawing) return;
    
    isDrawing = false;
    
    if (lassoPoints.length > 2) {
        selectionCtx.lineTo(lassoPoints[0].x, lassoPoints[0].y);
        selectionCtx.stroke();
        selectionCtx.closePath();
    }
}

function clearLassoSelection() {
    selectionCtx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
    lassoPoints = [];
}