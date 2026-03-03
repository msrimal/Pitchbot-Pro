const btn = document.getElementById("generateBtn");
const input = document.getElementById("jsonInput");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");

function setStatus(msg) {
  statusEl.textContent = msg || "";
}

function showResult(html) {
  resultEl.style.display = "block";
  resultEl.innerHTML = html;
}

btn.addEventListener("click", async () => {
  resultEl.style.display = "none";
  setStatus("");

  let payload;
  try {
    payload = JSON.parse(input.value);
  } catch (e) {
    setStatus("Invalid JSON. Please fix formatting.");
    return;
  }

  setStatus("Generating…");

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
      <div><b>Slides link:</b> <a href="${data.presentation_url}" target="_blank" rel="noreferrer">${data.presentation_url}</a></div>
      <div style="margin-top:10px;"><b>Generated pitch:</b></div>
      <pre>${data.pitch_text}</pre>
    `);
  } catch (e) {
    setStatus("");
    showResult(`<b>Error:</b> ${String(e)}`);
  }
});