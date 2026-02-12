const form = document.getElementById("auditForm");
const statusEl = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");

const results = document.getElementById("results");
const problems = document.getElementById("problems");
const quickWins = document.getElementById("quickWins");
const tier = document.getElementById("tier");
const nextAction = document.getElementById("nextAction");

const bookLink = document.getElementById("bookLink");
const buyLink = document.getElementById("buyLink");

// TODO: Replace with your real links (Calendly + Stripe)
const LINKS = {
  book: "https://calendly.com/",
  ignite: "https://buy.stripe.com/",
  accelerate: "https://buy.stripe.com/",
  dominate: "https://calendly.com/"
};

function setStatus(msg) {
  statusEl.textContent = msg || "";
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? "Running..." : "Run Audit";
}

function fillList(el, items) {
  el.innerHTML = "";
  (items || []).forEach((x) => {
    const li = document.createElement("li");
    li.textContent = String(x);
    el.appendChild(li);
  });
}

function pickCta(recommendedTier) {
  const t = (recommendedTier || "").toLowerCase();

  bookLink.href = LINKS.book;

  if (t.includes("ignite")) buyLink.href = LINKS.ignite;
  else if (t.includes("accelerate")) buyLink.href = LINKS.accelerate;
  else {
    // Dominate or unknown -> call
    buyLink.href = LINKS.dominate;
    buyLink.textContent = "Request White-Glove";
    return;
  }
  buyLink.textContent = "Start Now";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setStatus("");
  results.classList.add("hidden");

  const data = Object.fromEntries(new FormData(form).entries());
  const payload = {
    agentId: "audit.v1",
    input: {
      businessType: data.businessType,
      hasWebsite: data.hasWebsite,
      monthlyLeads: Number(data.monthlyLeads),
      bookingMethod: data.bookingMethod,
      biggestPain: data.biggestPain
    }
  };

  try {
    setLoading(true);
    setStatus("Calling audit agent…");

    const res = await fetch("/.netlify/functions/run-audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`);

    const json = JSON.parse(text);

    fillList(problems, json.problems);
    fillList(quickWins, json.quickWins);
    tier.textContent = json.recommendedTier || "—";
    nextAction.textContent = json.nextAction || "—";

    pickCta(json.recommendedTier);

    results.classList.remove("hidden");
    setStatus("Done.");
  } catch (err) {
    console.error(err);
    setStatus(`Error: ${err.message || err}`);
  } finally {
    setLoading(false);
  }
});

