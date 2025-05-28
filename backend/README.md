# Documentazione per l'Integrazione di Generazione Audio Reale

## Panoramica
Il sito web AI Music Generator è stato aggiornato per supportare la generazione di audio reale utilizzando l'API Replicate con il modello Meta MusicGen. Questa integrazione permette agli utenti di generare vere canzoni con voce cantata e musica in vari stili, partendo da prompt testuali.

## Componenti Implementati

### Backend (Flask)
- Endpoint API `/api/generate-music` per la generazione musicale
- Integrazione con Replicate API per il modello MusicGen
- Gestione del download e salvataggio dei file audio generati
- Modalità di fallback per test senza token API

### Frontend
- Form di generazione con supporto per prompt e genere musicale
- Player audio per la riproduzione delle canzoni generate
- Funzionalità di download delle canzoni generate
- Interfaccia utente reattiva e intuitiva

## Configurazione Necessaria

Per utilizzare la generazione audio reale, è necessario:

1. Creare un account su [Replicate](https://replicate.com/)
2. Ottenere un token API da Replicate
3. Configurare il token nel file `backend/app.py`:
   ```python
   REPLICATE_API_TOKEN = "r8_il_tuo_token_qui"
   ```

## Funzionamento

1. L'utente inserisce un prompt testuale e opzionalmente seleziona un genere musicale
2. Il frontend invia la richiesta al backend Flask
3. Il backend chiama l'API Replicate con il modello MusicGen
4. Replicate genera l'audio in base al prompt
5. Il backend scarica il file audio e lo salva localmente
6. Il frontend riceve l'URL del file audio e lo riproduce

## Limitazioni Attuali

- La generazione richiede un token API Replicate valido
- Senza token, il sistema funziona in modalità simulazione
- La durata dell'audio è limitata a 30 secondi per ottimizzare i tempi di generazione
- La qualità dell'audio dipende dalla precisione del prompt

## Miglioramenti Futuri

- Implementazione di un database per salvare le canzoni generate
- Supporto per durate personalizzabili
- Integrazione di più modelli di generazione audio
- Funzionalità avanzate come estrazione di stems e remix

## Note Tecniche

- Il modello MusicGen utilizzato è la versione "melody" di Meta
- Il formato di output è impostato su WAV per massima qualità
- La generazione richiede circa 10-30 secondi per completarsi
- L'API ha un costo per utilizzo, verificare la documentazione di Replicate per i dettagli sui prezzi
