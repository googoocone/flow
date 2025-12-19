import uvicorn
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from faster_whisper import WhisperModel
import os
import shutil
import time

# Initialize FastAPI
app = FastAPI()

# Allow CORS (in case we call from frontend directly, though we are calling from server action)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Whisper Model
# 'large-v3' is the latest and greatest. 
# device='cuda' uses the GPU (RTX 4070). 
# compute_type='float16' is standard for GPU inference.
print("Loading Whisper Model (large-v3) on GPU...")
model = WhisperModel("large-v3", device="cuda", compute_type="float16")
print("Model Loaded!")

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    start_time = time.time()
    
    # Save uploaded file temporarily
    temp_filename = f"temp_{file.filename}"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    print(f"Transcribing {file.filename}...")
    
    try:
        # Transcribe
        # beam_size=5 is standard.
        segments, info = model.transcribe(temp_filename, beam_size=5, language="ko")
        
        # Collect text
        transcript_text = ""
        for segment in segments:
            transcript_text += segment.text + " "
            # print(f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}")
        
        duration = time.time() - start_time
        print(f"Transcription complete in {duration:.2f}s")
        
        return {
            "transcript": transcript_text.strip(),
            "language": info.language,
            "duration_seconds": duration
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {"error": str(e)}
        
    finally:
        # Cleanup temp file
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

if __name__ == "__main__":
    # Run server
    uvicorn.run(app, host="0.0.0.0", port=8000)
