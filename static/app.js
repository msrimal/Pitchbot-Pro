const form = document.getElementById("pitch-form");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const btn = document.getElementById("generateBtn");

function setStatus(msg) {
  statusEl.textContent = msg || "";
}

function showResult(html) {
  resultEl.style.display = "block";
  resultEl.innerHTML = html;
}

async function sendPayload(payload) {
  setStatus("Generating…");
  btn.disabled = true;

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus("");
      showResult(`<b>Error:</b> ${data.error || "Unknown error"}`);
      return;
    }

    setStatus("Done.");
    showResult(`
      <div><b>Slides link:</b>
        <a href="${data.presentation_url}" target="_blank" rel="noreferrer">
          ${data.presentation_url}
        </a>
      </div>
      <div style="margin-top:10px;"><b>Generated pitch:</b></div>
      <pre>${data.pitch_text}</pre>
    `);
  } catch (e) {
    setStatus("");
    showResult(`<b>Error:</b> ${String(e)}`);
  } finally {
    btn.disabled = false;
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  resultEl.style.display = "none";
  setStatus("");

  const problem = document.getElementById("problem").value.trim();
  const solution = document.getElementById("solution").value.trim();
  const audience = document.getElementById("audience").value.trim();
  const tone = document.getElementById("tone").value;

  if (!problem || !solution || !audience || !tone) {
    setStatus("Please fill in all required fields.");
    return;
  }

  // IMPORTANT: payload keys MUST match what your backend expects
  const payload = {
    problem,
    "solution-idea": solution,
    tone,
    audience,
  };

  await sendPayload(payload);
});