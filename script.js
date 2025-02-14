// Inizializzazione delle variabili
let imageCanvas, selectionCanvas;
let ctx, selectionCtx;
let isDrawing = false;
let lassoPoints = [];
let currentImage = null;

// Configurazione API
const API_KEY = 'sk-1Yw27y4YsUVbqFtDTRVlQmeH6jkXdbBLz1Y6wxUSZoefy1bd';
const API_ENDPOINT = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image';

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
    
    // Ridisegna l'immagine se presente
    if (currentImage) {
        drawImage(currentImage);
    }
}

function setupEventListeners() {
    const imageInput = document.getElementById('imageInput');
    const lassoTool = document.getElementById('lassoTool');
    const clearSelection = document.getElementById('clearSelection');
    const generateBtn = document.getElementById('generateBtn');
    
    imageInput.addEventListener('change', handleImageUpload);
    lassoTool.addEventListener('click', toggleLassoTool);
    clearSelection.addEventListener('click', clearLassoSelection);
    generateBtn.addEventListener('click', generateImage);
    
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
        document.getElementById('generateBtn').disabled = false;
    }
}

function clearLassoSelection() {
    selectionCtx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
    lassoPoints = [];
    document.getElementById('generateBtn').disabled = true;
}

async function generateImage() {
    if (!currentImage || lassoPoints.length < 3) {
        alert('Seleziona un\'area con il lazo prima di generare');
        return;
    }
    
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.remove('hidden');
    
    try {
        // Crea la maschera
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = imageCanvas.width;
        maskCanvas.height = imageCanvas.height;
        const maskCtx = maskCanvas.getContext('2d');
        
        // Disegna la maschera
        maskCtx.fillStyle = 'white';
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        maskCtx.fillStyle = 'black';
        maskCtx.beginPath();
        maskCtx.moveTo(lassoPoints[0].x, lassoPoints[0].y);
        lassoPoints.forEach(point => maskCtx.lineTo(point.x, point.y));
        maskCtx.closePath();
        maskCtx.fill();
        
        // Prepara i dati per l'API
        const prompt = document.getElementById('promptInput').value;
        const imageBlob = await new Promise(resolve => imageCanvas.toBlob(resolve));
        const maskBlob = await new Promise(resolve => maskCanvas.toBlob(resolve));
        
        const formData = new FormData();
        formData.append('init_image', imageBlob);
        formData.append('mask_image', maskBlob);
        formData.append('prompt', prompt);
        formData.append('mask_source', 'MASK_IMAGE_BLACK');
        
        // Chiamata API
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            },
            body: formData
        });
        
        if (!response.ok) throw new Error('Errore nella generazione dell\'immagine');
        
        const result = await response.json();
        
        // Mostra il risultato
        const resultImage = new Image();
        resultImage.onload = () => {
            const gallery = document.getElementById('resultsGallery');
            const container = document.createElement('div');
            container.className = 'result-container';
            
            // Aggiungi l'immagine
            container.appendChild(resultImage);
            
            // Aggiungi il pulsante Applica
            const applyBtn = document.createElement('button');
            applyBtn.textContent = 'Applica Modifiche';
            applyBtn.className = 'apply-btn';
            applyBtn.onclick = () => {
                ctx.drawImage(resultImage, 0, 0, imageCanvas.width, imageCanvas.height);
                currentImage = resultImage;
                clearLassoSelection();
                container.remove();
            };
            
            container.appendChild(applyBtn);
            gallery.insertBefore(container, gallery.firstChild);
        };
        
        resultImage.src = `data:image/png;base64,${result.images[0].base64}`;
        
    } catch (error) {
        console.error('Errore durante la generazione:', error);
        alert('Errore durante la generazione dell\'immagine');
    } finally {
        loadingOverlay.classList.add('hidden');
    }
}