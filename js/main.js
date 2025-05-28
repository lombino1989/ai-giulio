// Aggiornamento del file main.js per integrare la generazione audio reale
document.addEventListener('DOMContentLoaded', function() {
    // Toggle advanced options
    const advancedToggle = document.querySelector('.advanced-toggle');
    const advancedOptions = document.querySelector('.advanced-options');
    
    if (advancedToggle && advancedOptions) {
        advancedToggle.addEventListener('click', function() {
            advancedOptions.classList.toggle('hidden');
            advancedToggle.textContent = advancedOptions.classList.contains('hidden') 
                ? 'Modalità avanzata' 
                : 'Modalità semplice';
        });
    }
    
    // Example prompts functionality
    const exampleBtns = document.querySelectorAll('.example-btn');
    const promptInput = document.querySelector('.prompt-input');
    
    if (exampleBtns.length && promptInput) {
        exampleBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                promptInput.value = this.textContent.trim();
            });
        });
    }
    
    // Form submission (real generation with API)
    const generatorForm = document.querySelector('.generator-form');
    const audioPlayer = document.querySelector('.audio-player');
    
    if (generatorForm && audioPlayer) {
        generatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!promptInput.value.trim()) {
                alert('Inserisci un prompt per generare una canzone');
                return;
            }
            
            // Show loading state
            const generateBtn = document.querySelector('.generate-btn');
            const originalBtnText = generateBtn.textContent;
            generateBtn.textContent = 'Generazione...';
            generateBtn.disabled = true;
            
            // Get genre if available
            const genreSelect = document.querySelector('.option-group select');
            const genre = genreSelect && genreSelect.value ? genreSelect.value : '';
            
            // Prepare data for API call
            const data = {
                prompt: promptInput.value.trim(),
                genre: genre
            };
            
            // Call the backend API
            fetch('http://localhost:5000/api/generate-music', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    // Update song info
                    const songTitle = document.querySelector('.song-info h3');
                    const songGenre = document.querySelector('.song-info p');
                    
                    if (songTitle && songGenre) {
                        songTitle.textContent = result.song.title;
                        songGenre.textContent = result.song.genre;
                    }
                    
                    // Update audio source
                    const audioElement = document.querySelector('audio');
                    if (audioElement) {
                        audioElement.src = result.song.file_path;
                        audioElement.load();
                    }
                    
                    // Show player
                    audioPlayer.classList.remove('hidden');
                    
                    // Scroll to player
                    audioPlayer.scrollIntoView({ behavior: 'smooth' });
                } else {
                    alert('Errore durante la generazione: ' + (result.error || 'Errore sconosciuto'));
                }
            })
            .catch(error => {
                console.error('Errore:', error);
                alert('Errore durante la generazione. Controlla la console per dettagli.');
            })
            .finally(() => {
                // Reset button
                generateBtn.textContent = originalBtnText;
                generateBtn.disabled = false;
            });
        });
    }
    
    // Audio player functionality (real audio)
    const playButton = document.querySelector('.play-button');
    const audioElement = document.createElement('audio');
    audioElement.id = 'audio-element';
    audioElement.style.display = 'none';
    document.body.appendChild(audioElement);
    
    if (playButton) {
        playButton.addEventListener('click', function() {
            const isPlaying = this.textContent === '❚❚';
            
            if (isPlaying) {
                // Pause
                audioElement.pause();
                this.textContent = '▶';
            } else {
                // Play
                audioElement.play();
                this.textContent = '❚❚';
            }
        });
    }
    
    // Update time slider and display when audio is playing
    if (audioElement) {
        audioElement.addEventListener('timeupdate', function() {
            const timeSlider = document.querySelector('.time-slider');
            const currentTime = document.querySelector('.current-time');
            
            if (timeSlider && currentTime) {
                timeSlider.value = this.currentTime;
                currentTime.textContent = formatTime(this.currentTime);
            }
        });
        
        audioElement.addEventListener('loadedmetadata', function() {
            const timeSlider = document.querySelector('.time-slider');
            const durationDisplay = document.querySelector('.duration');
            
            if (timeSlider && durationDisplay) {
                timeSlider.max = this.duration;
                durationDisplay.textContent = formatTime(this.duration);
            }
        });
        
        audioElement.addEventListener('ended', function() {
            const playButton = document.querySelector('.play-button');
            if (playButton) {
                playButton.textContent = '▶';
            }
        });
        
        // Allow seeking
        const timeSlider = document.querySelector('.time-slider');
        if (timeSlider) {
            timeSlider.addEventListener('input', function() {
                audioElement.currentTime = this.value;
            });
        }
    }
    
    // Format time helper function
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
    
    // Download button functionality
    const downloadBtn = document.querySelector('.action-btn.download');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            if (audioElement.src) {
                const a = document.createElement('a');
                a.href = audioElement.src;
                a.download = 'ai-music-' + Date.now() + '.wav';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        });
    }
    
    // Tab functionality for library
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    if (tabBtns.length) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all tabs
                tabBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
            });
        });
    }
});
