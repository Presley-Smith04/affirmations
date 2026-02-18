let userName = "";
let currentCategory = "";
let currentMode = "angel";

//list categories
const categories = [
  "self_love",
  "confidence",
  "health",
  "relationships",
  "success",
  "mindfulness",
  "spiritual",
  "protection",
  "creativity",
  "gratitude",
];

//get name
function nextStep(step) {
  if (step === "name") {
    userName = document.getElementById("name").value || "Unc";
    document.getElementById("greeting").innerText =
      `Hi ${userName}, how are you feeling today?`;
    document.getElementById("step-name").style.display = "none";
    document.getElementById("step-mood").style.display = "block";
    updateTheme();

    //get mood
  } else if (step === "mood") {
    const moodInput = document
      .getElementById("mood")
      .value.trim()
      .toLowerCase();

    //possible moods
    const moodsMap = {
      mindfulness: [
        "stressed",
        "insane",
        "crazy",
        "overwhelmed",
        "anxious",
        "scattered",
      ],
      health: [
        "tired",
        "sleepy",
        "fat",
        "strong",
        "weak",
        "sluggish",
        "energetic",
      ],
      success: [
        "motivated",
        "unmotivated",
        "apathetic",
        "uninspired",
        "lazy",
        "ambitious",
      ],
      confidence: [
        "happy",
        "unconfident",
        "unsure",
        "hesitant",
        "indecisive",
        "bold",
        "worthy",
      ],
      spiritual: [
        "lost",
        "disconnected",
        "searching",
        "aligned",
        "empty",
        "enlightened",
      ],
      gratitude: [
        "bitter",
        "jealous",
        "resentful",
        "blessed",
        "lucky",
        "unappreciative",
      ],
      protection: [
        "vulnerable",
        "exposed",
        "defensive",
        "unsafe",
        "threatened",
        "secure",
      ],
      creativity: [
        "blocked",
        "stagnant",
        "inspired",
        "dull",
        "expressive",
        "original",
      ],
    };

    //suggest categoreyeus
    let suggestedCategory = null;
    for (const [cat, moods] of Object.entries(moodsMap)) {
      if (moods.includes(moodInput)) suggestedCategory = cat;
    }

    let suggestionText = "";
    if (!suggestedCategory) {
      suggestedCategory = "self_love";
      suggestionText =
        "Hmm, that’s an interesting mood! Please pick a category below.";
    }

    //preselected category
    currentCategory = suggestedCategory;
    document.getElementById("mood-suggestion").innerText = suggestionText;

    showCategoryPage();
  }
}

//generate
async function generateAffirmation() {
  const category = currentCategory;

  //get response
  const response = await fetch("/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category, mode: currentMode }),
  });

  const data = await response.json();

  //show affirmation
  document.getElementById("step-category").style.display = "none";
  document.getElementById("affirmation-wrapper").style.display = "block";

  //fade in
  const affirmationEl = document.getElementById("affirmation-text");
  affirmationEl.style.opacity = 0;
  affirmationEl.innerText = data.affirmation;

  //trigger reflow for animation
  void affirmationEl.offsetWidth;
  affirmationEl.style.animation = "fadeIn 0.6s forwards";
}

//get another
async function generateAnother() {
  if (!currentCategory) return;
  const affirmationEl = document.getElementById("affirmation-text");
  affirmationEl.style.opacity = 0; // reset fade

  const response = await fetch("/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category: currentCategory, mode: currentMode }),
  });
  const data = await response.json();

  affirmationEl.innerText = data.affirmation;

  // Re-trigger fade-in animation
  void affirmationEl.offsetWidth;
  affirmationEl.style.animation = "fadeIn 0.6s forwards";
}

//home page
function goHome() {
  document.getElementById("affirmation-wrapper").style.display = "none";
  document.getElementById("step-name").style.display = "block";
  document.getElementById("step-mood").style.display = "none";
  document.getElementById("step-category").style.display = "none";

  document.getElementById("name").value = "";
  document.getElementById("mood").value = "";
  document.getElementById("mood-suggestion").innerText = "";
}

//go to categories
function showCategoryPage() {
  document.getElementById("affirmation-wrapper").style.display = "none";
  document.getElementById("step-name").style.display = "none";
  document.getElementById("step-mood").style.display = "none";
  document.getElementById("step-category").style.display = "block";

  //cards for categories
  const grid = document.getElementById("category-cards");
  grid.innerHTML = "";

  categories.forEach((cat) => {
    const card = document.createElement("div");
    card.className = "category-card";
    card.innerText = cat.replace("_", " ").toUpperCase();
    card.onclick = () => {
      currentCategory = cat;
      generateAffirmation();
    };
    grid.appendChild(card);
  });
  updateTheme();
}

const particleContainer = document.querySelector(".particles");

for (let i = 0; i < 40; i++) {
  const particle = document.createElement("span");
  particle.style.left = Math.random() * window.innerWidth + "px";
  particle.style.top = Math.random() * window.innerHeight + "px";
  particle.style.width = 2 + Math.random() * 6 + "px";
  particle.style.height = particle.style.width;
  particle.style.opacity = 0.5 + Math.random() * 0.7;
  particle.style.animationDuration = 8 + Math.random() * 12 + "s";
  particle.style.animationDelay = Math.random() * 5 + "s";
  particleContainer.appendChild(particle);
}

const modeBtn = document.getElementById("mode-toggle");

modeBtn.addEventListener("click", () => {
  const body = document.body;
  if (currentMode === "angel") {
    currentMode = "devil";
    body.classList.add("devil-mode");
    modeBtn.textContent = "😈";
  } else {
    currentMode = "angel";
    body.classList.remove("devil-mode");
    modeBtn.textContent = "😇";
  }

  updateTheme();
});

function updateTheme() {
  const h1 = document.querySelector("h1");
  const grid = document.getElementById("category-cards");
  const particles = document.querySelector(".particles");
  const affirmationText = document.getElementById("affirmation-text");
  const greetingText = document.getElementById("greeting");
  const moodSuggestionText = document.getElementById("mood-suggestion");

  //change greeting and suggestion
  if (greetingText && moodSuggestionText) {
    if (currentMode === "devil") {
      greetingText.innerText = `Hey ${userName || "Unc"}, wanna be humbled?`;
      moodSuggestionText.innerText = "Pick one of these to get humbled.";
    } else {
      greetingText.innerText = `Hi ${userName || "friend"}, how are you feeling today?`;
      moodSuggestionText.innerText = "Pick a mood to get your affirmation.";
    }
  }

  //clear cards
  grid.innerHTML = "";

  //recreate cards
  let cardsToUse = [];
  if (currentMode === "devil") {
    cardsToUse = ["ambition", "existence", "social", "future"];
  } else {
    cardsToUse = categories;
  }

  //recreate cards part 2
  categories.forEach((cat) => {
    const card = document.createElement("div");
    card.className = "category-card";
    card.innerText = cat.replace("_", " ").toUpperCase();
    card.onclick = () => {
      currentCategory = cat;
      generateAffirmation();
    };
    grid.appendChild(card);
  });

  //update h1 colors
  if (currentMode === "devil") {
    h1.style.color = "#ff3c3c";
    h1.textContent = "Negative Affirmations";
  } else {
    h1.style.color = "#ffffff";
    h1.textContent = "Positive Affirmations";
  }

  if (currentMode === "devil") {
    h1.style.color = "#ff3c3c";
    affirmationText.style.color = "#ff4d4d";
  } else {
    h1.style.color = "#ffffff";
    affirmationText.style.color = "#e0f7f7"; // your soft zen color
  }

  //reset particles
  particles.innerHTML = "";
  const particleCount = 40;
  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement("span");
    p.style.left = Math.random() * window.innerWidth + "px";
    p.style.top = Math.random() * window.innerHeight + "px";
    p.style.width = 2 + Math.random() * 6 + "px";
    p.style.height = p.style.width;
    p.style.opacity = 1 + Math.random() * 0.7;
    p.style.animationDuration = 8 + Math.random() * 12 + "s";
    p.style.animationDelay = Math.random() * 5 + "s";

    // color particles differently depending on mode
    if (currentMode === "devil") {
      p.style.background = "rgba(255, 0, 0, 0.6)";
    } else {
      p.style.background = "rgba(255, 255, 255, 0.6)";
    }

    particles.appendChild(p);
  }
}
