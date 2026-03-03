import json
import re
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

# Loads .env for local dev (OPENAI + GOOGLE env vars)
load_dotenv()

# Import functions from your existing file
from pitchbot import (
    generate_pitch,
    authenticate_google_slides,
    create_presentation,
    populate_title_slide,
    extract_sections,
    create_section_slide,
)

app = Flask(__name__)

@app.get("/")
def home():
    return render_template("index.html")

@app.get("/create")
def create():
    return render_template("create.html")

@app.get("/how-it-works")
def how_it_works():
    return render_template("how_it_works.html")

@app.post("/api/generate")
def api_generate():
    try:
        payload = request.get_json(force=True)

        # Basic validation (same required fields you already enforce)
        required = ["problem", "solution-idea", "tone", "audience"]
        for k in required:
            if k not in payload or not str(payload[k]).strip():
                return jsonify({"error": f"Missing or empty field: {k}"}), 400

        pitch = generate_pitch(payload)

        slides_service = authenticate_google_slides()
        presentation_id = create_presentation(slides_service, title="PitchBot Deck")

        sections = extract_sections(pitch)
        name_key = next((k for k in sections if k.startswith("Startup Name")), None)
        if name_key:
            startup_name = sections.pop(name_key).strip()
            if not startup_name:
                raw = re.sub(r'^Startup Name\s*[:\-–—]?\s*', '', name_key)
                startup_name = re.sub(r'\(.*?\)', '', raw).strip() or "Startup Pitch"
        else:
            startup_name = "Startup Pitch"
        populate_title_slide(slides_service, presentation_id, startup_name)
        for section_title, content in sections.items():
            create_section_slide(slides_service, presentation_id, section_title, content)

        url = f"https://docs.google.com/presentation/d/{presentation_id}/edit"
        return jsonify({"presentation_url": url, "pitch_text": pitch})

    except Exception as e:
        # Keep errors readable while you debug
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)