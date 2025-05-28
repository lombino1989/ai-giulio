from flask import Flask, request, jsonify, send_from_directory
import os
import requests
import time
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configurazione
# In produzione, questo token dovrebbe essere impostato come variabile d'ambiente
REPLICATE_API_TOKEN = "r8_YOUR_REPLICATE_TOKEN"
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static/audio")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Assicurati che la directory esista
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/static/audio/<path:filename>')
def serve_audio(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/api/generate-music', methods=['POST'])
def generate_music():
    data = request.json
    
    if not data or 'prompt' not in data:
        return jsonify({"success": False, "error": "Prompt mancante"}), 400
    
    prompt = data.get('prompt')
    genre = data.get('genre', '')
    
    # Combina prompt e genere se il genere è specificato
    if genre:
        full_prompt = f"{prompt}. Genre: {genre}"
    else:
        full_prompt = prompt
    
    try:
        # Verifica se abbiamo un token API valido
        if REPLICATE_API_TOKEN and REPLICATE_API_TOKEN != "r8_YOUR_REPLICATE_TOKEN":
            # Chiamata all'API di Replicate per generare la musica
            headers = {
                "Authorization": f"Token {REPLICATE_API_TOKEN}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "version": "7a76a8258b23fae65c5a22debb8841d1d7e816b75c2f24218cd2bd8573787906",
                "input": {
                    "model_version": "melody",
                    "prompt": full_prompt,
                    "duration": 30,  # Durata in secondi
                    "output_format": "wav",
                    "continuation": False,
                    "continuation_start": 0,
                    "normalization_strategy": "peak",
                    "classifier_free_guidance": 3
                }
            }
            
            # Inizia la generazione
            response = requests.post(
                "https://api.replicate.com/v1/predictions",
                headers=headers,
                json=payload
            )
            
            if response.status_code != 201:
                return jsonify({"success": False, "error": f"Errore API Replicate: {response.text}"}), 500
            
            prediction = response.json()
            prediction_id = prediction["id"]
            
            # Controlla lo stato della generazione
            while True:
                response = requests.get(
                    f"https://api.replicate.com/v1/predictions/{prediction_id}",
                    headers=headers
                )
                
                if response.status_code != 200:
                    return jsonify({"success": False, "error": f"Errore nel controllo dello stato: {response.text}"}), 500
                
                prediction = response.json()
                
                if prediction["status"] == "succeeded":
                    break
                elif prediction["status"] == "failed":
                    return jsonify({"success": False, "error": "Generazione fallita"}), 500
                
                time.sleep(1)
            
            # Ottieni l'URL del file audio generato
            output_url = prediction["output"]
            
            if not output_url:
                return jsonify({"success": False, "error": "Nessun output generato"}), 500
            
            # Scarica il file audio
            audio_response = requests.get(output_url)
            
            if audio_response.status_code != 200:
                return jsonify({"success": False, "error": "Impossibile scaricare il file audio"}), 500
            
            # Genera un nome file unico
            timestamp = int(time.time())
            filename = f"song_{timestamp}.wav"
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            
            # Salva il file audio
            with open(filepath, "wb") as f:
                f.write(audio_response.content)
            
            # Costruisci l'URL per accedere al file
            file_url = f"/static/audio/{filename}"
            
            # Crea l'oggetto canzone
            song = {
                "id": timestamp,
                "title": prompt,
                "genre": genre or "Generale",
                "file_path": file_url,
                "created_at": timestamp
            }
            
            return jsonify({
                "success": True,
                "song": song
            })
        else:
            # Modalità simulazione (per test senza API key)
            # Genera un nome file unico
            timestamp = int(time.time())
            filename = f"song_{timestamp}.wav"
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            
            # Per test, crea un file audio di esempio
            # In una versione reale, questo sarebbe sostituito con l'audio generato dall'API
            sample_audio_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static/sample_audio.wav")
            if os.path.exists(sample_audio_path):
                with open(sample_audio_path, "rb") as src, open(filepath, "wb") as dst:
                    dst.write(src.read())
            else:
                # Se non esiste un file di esempio, crea un file vuoto
                with open(filepath, "wb") as f:
                    f.write(b"Test audio file")
            
            # Costruisci l'URL per accedere al file
            file_url = f"/static/audio/{filename}"
            
            # Crea l'oggetto canzone
            song = {
                "id": timestamp,
                "title": prompt,
                "genre": genre or "Generale",
                "file_path": file_url,
                "created_at": timestamp
            }
            
            # Simula un ritardo di generazione
            time.sleep(2)
            
            return jsonify({
                "success": True,
                "song": song,
                "note": "Questa è una simulazione. Per la generazione reale, configura un token API Replicate valido."
            })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/songs', methods=['GET'])
def get_songs():
    # In una versione reale, questo recupererebbe le canzoni da un database
    # Per ora, restituiamo un elenco vuoto
    return jsonify({"success": True, "songs": []})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
