// Inizializzazione delle variabili
let imageCanvas, selectionCanvas;
let ctx, selectionCtx;
let isDrawing = false;
let lassoPoints = [];
let currentImage = null;

// Configurazione API
const API_KEY = 'sk-1Yw27y4YsUVbqFtDTRVlQmeH6jkXdbBLz1Y6wxUSZoefy1bd';
const API_ENDPOINT = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';

// Stili predefiniti per ogni categoria
const styles = {
    coastal: {
        prompt: "dipinto impressionista di costa mediterranea, grande fico d'india in primo piano con frutti maturi, mare azzurro cristallino, cielo al tramonto con nuvole rosa e viola, casa in pietra sulla scogliera, stile pittorico dettagliato con pennellate evidenti, olio su tela",
        negative: "fotografia, bassa qualità, sfocato, arte digitale"
    },
    countryside: {
        prompt: "dipinto di campagna mediterranea, ulivi secolari contorti in primo piano, muretti a secco antichi, campo di grano dorato, fiori di campo colorati, casetta tradizionale con tetto in tegole sullo sfondo, cielo azzurro con nuvole bianche, stile pittorico con texture pronunciata",
        negative: "fotografia, bassa qualità, sfocato, arte digitale"
    },
    harbor: {
        prompt: "dipinto di porto mediterraneo, faro bianco sulla scogliera, barca tradizionale colorata in primo piano, bouganville in fiore su un vecchio arco in pietra, mare turchese calmo, cielo al tramonto con nuvole colorate, stile pittorico mediterraneo dettagliato",
        negative: "fotografia, bassa qualità, sfocato, arte digitale"
    },
    village: {
        prompt: "dipinto di borgo mediterraneo antico, stradina con scalini in pietra, archi antichi con bouganville, fichi d'india sui muretti, vista sul mare in lontananza, cielo azzurro con nuvole soffici, stile pittorico impressionista dettagliato",
        negative: "fotografia, bassa qualità, sfocato, arte digitale"
    }
};

// Elementi DOM
const generateBtn = document.getElementById('generateBtn');
const styleSelect = document.getElementById('styleSelect');
const imageContainer = document.getElementById('imageContainer');
const imageHistory = document.getElementById('imageHistory');
const loadingSpinner = document.getElementById('loadingSpinner');

// Array per memorizzare lo storico delle immagini
let generatedImages = [];

// Funzione per generare un'immagine
async function generateImage() {
    try {
        loadingSpinner.classList.remove('hidden');
        generateBtn.disabled = true;

        const selectedStyle = styles[styleSelect.value];
        
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
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
                steps: 50,
                style_preset: "painterly"
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const imageData = result.artifacts[0].base64;
        
        // Crea e mostra la nuova immagine
        displayNewImage(imageData);
        
        // Aggiungi l'immagine allo storico
        addToHistory(imageData);

    } catch (error) {
        console.error('Errore durante la generazione:', error);
        alert('Errore durante la generazione dell\'immagine. Riprova più tardi.');
    } finally {
        loadingSpinner.classList.add('hidden');
        generateBtn.disabled = false;
    }
}

// Funzione per mostrare la nuova immagine
function displayNewImage(base64Data) {
    imageContainer.innerHTML = '';
    const img = document.createElement('img');
    img.src = `data:image/png;base64,${base64Data}`;
    imageContainer.appendChild(img);
}

// Funzione per aggiungere un'immagine allo storico
function addToHistory(base64Data) {
    const img = document.createElement('img');
    img.src = `data:image/png;base64,${base64Data}`;
    
    // Aggiungi l'immagine all'inizio dello storico
    imageHistory.insertBefore(img, imageHistory.firstChild);
    
    // Limita il numero di immagini nello storico a 12
    generatedImages.unshift(base64Data);
    if (generatedImages.length > 12) {
        generatedImages.pop();
        if (imageHistory.lastChild) {
            imageHistory.removeChild(imageHistory.lastChild);
        }
    }
}

// Event listener per il pulsante di generazione
generateBtn.addEventListener('click', generateImage);

// Inizializzazione al caricamento della pagina
document.addEventListener('DOMContentLoaded', () => {
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