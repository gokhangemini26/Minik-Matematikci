
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import edge_tts
import tempfile
import os
from fastapi.responses import FileResponse

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SpeakRequest(BaseModel):
    text: str

@app.post("/speak")
async def speak(request: SpeakRequest):
    try:
        # Create a temporary file
        # We use delete=False so we can serve it, but in a real app we might want to clean up
        # or stream directly. For simplicity, we save to a temp file.
        fd, path = tempfile.mkstemp(suffix=".mp3")
        os.close(fd)
        
        # Select voice - Emel is a good female Turkish voice, Ahmet is male.
        # Let's use Emel for a friendly teacher vibe.
        voice = "tr-TR-EmelNeural" 
        
        communicate = edge_tts.Communicate(request.text, voice)
        await communicate.save(path)
        
        return FileResponse(path, media_type="audio/mpeg", filename="speech.mp3")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
