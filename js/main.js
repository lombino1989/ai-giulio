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
    
    // Form submission (simulate generation)
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
            
            // Simulate generation delay
            setTimeout(function() {
                // Update song info
                const songTitle = document.querySelector('.song-info h3');
                const songGenre = document.querySelector('.song-info p');
                
                if (songTitle && songGenre) {
                    songTitle.textContent = promptInput.value.trim();
                    
                    const genreSelect = document.querySelector('.option-group select');
                    songGenre.textContent = genreSelect && genreSelect.value 
                        ? genreSelect.value 
                        : 'Pop';
                }
                
                // Show player
                audioPlayer.classList.remove('hidden');
                
                // Scroll to player
                audioPlayer.scrollIntoView({ behavior: 'smooth' });
                
                // Reset button
                generateBtn.textContent = originalBtnText;
                generateBtn.disabled = false;
            }, 3000);
        });
    }
    
    // Audio player functionality (simulation)
    const playButton = document.querySelector('.play-button');
    
    if (playButton) {
        playButton.addEventListener('click', function() {
            const isPlaying = this.textContent === '❚❚';
            this.textContent = isPlaying ? '▶' : '❚❚';
            
            // Simulate time progress when playing
            const timeSlider = document.querySelector('.time-slider');
            const currentTime = document.querySelector('.current-time');
            
            if (timeSlider && currentTime && !isPlaying) {
                let time = 0;
                const duration = 180; // 3 minutes in seconds
                
                timeSlider.max = duration;
                
                const interval = setInterval(function() {
                    time += 1;
                    
                    if (time > duration) {
                        clearInterval(interval);
                        playButton.textContent = '▶';
                        return;
                    }
                    
                    timeSlider.value = time;
                    currentTime.textContent = formatTime(time);
                }, 1000);
                
                // Store interval ID to clear it when paused
                playButton.dataset.intervalId = interval;
            } else if (isPlaying) {
                // Clear interval when paused
                clearInterval(playButton.dataset.intervalId);
            }
        });
    }
    
    // Format time helper function
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
    
    // Initialize time display
    const durationDisplay = document.querySelector('.duration');
    if (durationDisplay) {
        durationDisplay.textContent = '3:00'; // Default duration
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
