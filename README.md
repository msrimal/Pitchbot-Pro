# PitchDeck Pro (PitchBot)

PitchDeck Pro is a simple web application that turns a short JSON description of a startup idea into:

AI-generated pitch deck content
- A fully created Google Slides presentation
- A shareable Google Slides link
- The app runs locally using Flask and provides a clean frontend where users paste JSON instead of editing files manually in VS Code.

**What This Project Does**
- Serves a frontend at http://127.0.0.1:5000
- Accepts structured JSON input (problem, solution, tone, audience)
- Uses OpenAI to generate structured pitch content
- Automatically creates a new Google Slides deck
- Returns a link to the generated presentation

**System Requirements**

Before running the project, ensure you have:
- Python 3.10 or newer (3.12 confirmed working)
- pip (Python package manager)
- Internet access (required for OpenAI and Google API calls)

You will also need:
- An OpenAI API key
- A Google Cloud project with OAuth credentials

**Project Setup (From Scratch)**

**Follow these steps exactly if starting on a fresh machine.

1. Clone the Repository
git clone <YOUR_REPO_URL>
cd PitchBot

2. Create a Virtual Environment
macOS / Linux:

python3 -m venv venv
source venv/bin/activate

Windows (PowerShell):

python -m venv venv
venv\Scripts\Activate.ps1

After activation, your terminal should show:

(venv)
3. Install Dependencies
pip install -r reqs.txt

This installs:

openai

google-auth

google-auth-oauthlib

google-api-python-client

google-auth-httplib2

python-dotenv

flask

4. Create a .env File

In the project root, create a file named:

.env

Add the following:

OPENAI_API_KEY=your_openai_key_here
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token

**Do not include quotes.**

**Google Setup Instructions**

The application requires Google OAuth credentials with offline access so it can automatically refresh tokens.

Step 1 — Create a Google Cloud Project

Go to Google Cloud Console

Create or select a project

Enable:
- Google Slides API
- Google Drive API (recommended)

Step 2 — Configure OAuth Consent Screen
- Navigate to APIs & Services → OAuth consent screen
- Select External
- Fill required fields
- Add yourself as a Test User

Step 3 — Create OAuth Client ID
- Go to APIs & Services → Credentials
- Click Create Credentials → OAuth Client ID
- Application Type: Desktop App
- Create

**Copy:**

Client ID → GOOGLE_CLIENT_ID

Client Secret → GOOGLE_CLIENT_SECRET

Step 4 — Generate a Refresh Token (One Time Only)

Create a temporary file named get_refresh_token.py:

from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ['https://www.googleapis.com/auth/presentations']

flow = InstalledAppFlow.from_client_config(
    {
        "installed": {
            "client_id": "PASTE_CLIENT_ID_HERE",
            "client_secret": "PASTE_CLIENT_SECRET_HERE",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token"
        }
    },
    SCOPES
)

creds = flow.run_local_server(
    port=0,
    access_type="offline",
    prompt="consent"
)

print("\nREFRESH TOKEN:\n")
print(creds.refresh_token)

Replace the client ID and client secret with your own.

**Run:**

python get_refresh_token.py

A browser window will open. Log in and grant access.

The terminal will print:

REFRESH TOKEN:
1//0gxxxxxxxxxxxxxxxx

Copy that value into your .env file as:

GOOGLE_REFRESH_TOKEN=...

Afterward, delete the script:

rm get_refresh_token.py

You only need to do this once.

Running the Application

Once everything is configured:

source venv/bin/activate
python app.py

You should see:

Running on http://127.0.0.1:5000

**Open your browser and go to:

http://127.0.0.1:5000**


**How to Use the App**

Scroll to the “Create Your Deck” section.

Paste JSON in this format:

{
  "problem": "Teams waste time writing daily updates.",
  "solution-idea": "Auto-generate summary emails from bullet points.",
  "tone": "Professional, concise",
  "audience": "Internal teams and managers"
}

Click Generate Slides

Wait a few seconds

A Google Slides link will appear

Click the link to view your generated presentation

Common Issues
invalid_grant: Bad Request

This usually means:

The refresh token does not match the client ID/secret

The OAuth client type is incorrect

The refresh token was generated using a different OAuth client

Fix:

Ensure OAuth client type is Desktop App

Regenerate the refresh token using the exact client ID/secret

Update the .env file

Page Loads But Generation Fails

Check the terminal where Flask is running. The error message will be printed there.

Development Notes

The app uses Flask’s development server (debug=True)

Tokens are refreshed automatically each run

No manual login is required after the refresh token is configured

The frontend is a single-page layout using basic HTML/CSS/JS

Project Structure
PitchBot/
├── app.py
├── pitchbot.py
├── reqs.txt
├── templates/
│   └── index.html
├── static/
│   ├── styles.css
│   └── app.js
├── venv/           (local only)
└── .env            (local only)
