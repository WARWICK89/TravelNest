/* ===============================================
   TRAVELNEST - MAIN JAVASCRIPT FILE
   ===============================================
   This script handles all dynamic functionality:
   - Destination data and filtering
   - Budget calculations
   - Random trip generation
   - Local storage for saved data
   - Form validation and handling
   - Navigation and modals
   =============================================== */

/* ==================== DESTINATION DATA ====================
   Array of 10 travel destinations with complete information
   Each destination has properties for filtering, costs, and descriptions */
const destinationsData = [
  {
    id: 1,
    name: "Santorini",
    country: "Greece",
    continent: "Europe",
    type: "relaxation",
    budget: "high",
    image: "img/santorini-greece.jpg",
    description:
      "Stunning Greek island with white-washed buildings and blue domes.",
    attractions: ["Oia Sunset", "Red Beach", "Ancient Thera"],
    costs: { accommodation: 180, food: 65, transport: 40, activities: 85 },
  },
  {
    id: 2,
    name: "Kyoto",
    country: "Japan",
    continent: "Asia",
    type: "cultural",
    budget: "medium",
    image: "img/kyoto-japan.jpg",
    description: "Ancient temples, bamboo groves, traditional tea houses.",
    attractions: ["Fushimi Inari", "Kinkaku-ji", "Arashiyama"],
    costs: { accommodation: 95, food: 45, transport: 25, activities: 55 },
  },
  {
    id: 3,
    name: "Banff",
    country: "Canada",
    continent: "North America",
    type: "nature",
    budget: "medium",
    image: "img/banff-canada.jpg",
    description: "Turquoise lakes and snow-capped peaks in the Rockies.",
    attractions: ["Lake Louise", "Moraine Lake", "Banff Gondola"],
    costs: { accommodation: 120, food: 55, transport: 35, activities: 70 },
  },
  {
    id: 4,
    name: "Bali",
    country: "Indonesia",
    continent: "Asia",
    type: "relaxation",
    budget: "low",
    image: "img/bali-indonesia.jpg",
    description: "Rice terraces, sacred temples, affordable paradise.",
    attractions: ["Tegallalang", "Uluwatu Temple", "Monkey Forest"],
    costs: { accommodation: 35, food: 20, transport: 15, activities: 30 },
  },
  {
    id: 5,
    name: "Patagonia",
    country: "Argentina/Chile",
    continent: "South America",
    type: "adventure",
    budget: "high",
    image: "img/patagonia-argentina.jpg",
    description: "Glaciers, dramatic mountains, vast wilderness.",
    attractions: ["Torres del Paine", "Perito Moreno", "Fitz Roy"],
    costs: { accommodation: 150, food: 70, transport: 60, activities: 100 },
  },
  {
    id: 6,
    name: "Marrakech",
    country: "Morocco",
    continent: "Africa",
    type: "cultural",
    budget: "low",
    image: "img/marrakech-morocco.jpg",
    description: "Vibrant souks, palaces, gardens.",
    attractions: ["Jemaa el-Fnaa", "Majorelle Garden", "Bahia Palace"],
    costs: { accommodation: 45, food: 25, transport: 15, activities: 35 },
  },
  {
    id: 7,
    name: "Queenstown",
    country: "New Zealand",
    continent: "Oceania",
    type: "adventure",
    budget: "high",
    image: "img/queenstown-newzeland.jpg",
    description: "Adventure capital, stunning Southern Alps.",
    attractions: ["Milford Sound", "Skyline Gondola", "Bungy Jumping"],
    costs: { accommodation: 140, food: 60, transport: 45, activities: 120 },
  },
  {
    id: 8,
    name: "Reykjavik",
    country: "Iceland",
    continent: "Europe",
    type: "nature",
    budget: "high",
    image:
      "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=600&h=400&fit=crop",
    description: "Gateway to otherworldly landscapes, northern lights.",
    attractions: ["Blue Lagoon", "Golden Circle", "Northern Lights"],
    costs: { accommodation: 160, food: 80, transport: 70, activities: 90 },
  },
  {
    id: 9,
    name: "Hoi An",
    country: "Vietnam",
    continent: "Asia",
    type: "cultural",
    budget: "low",
    image: "img/hoi_an-vietnam.jpg",
    description: "Lantern-lit ancient town, riverside charm.",
    attractions: ["Ancient Town", "Japanese Bridge", "An Bang Beach"],
    costs: { accommodation: 30, food: 18, transport: 12, activities: 25 },
  },
  {
    id: 10,
    name: "Cape Town",
    country: "South Africa",
    continent: "Africa",
    type: "nature",
    budget: "medium",
    image: "img/cape_town-africa.jpg",
    description: "Coastal gem with Table Mountain, vineyards.",
    attractions: ["Table Mountain", "Cape of Good Hope", "Robben Island"],
    costs: { accommodation: 85, food: 40, transport: 30, activities: 60 },
  },
];

/* ==================== REUSABLE FUNCTIONS ====================
   Helper functions used throughout the application
   These functions handle common tasks like storage, validation, and alerts
   ==================== */

/* SAVE TO LOCAL STORAGE
   Adds new data to browser storage without overwriting existing data
   Gets existing array, pushes new item, saves back to storage */
function saveToLocalStorage(key, data) {
  let existing = JSON.parse(localStorage.getItem(key) || "[]");
  existing.push(data);
  localStorage.setItem(key, JSON.stringify(existing));
}

/* GET FROM LOCAL STORAGE
   Retrieves data from browser storage
   Returns empty array if key doesn't exist */
function getFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

/* SHOW ALERT MESSAGE
   Displays success or error messages to user
   Automatically hides after 4 seconds */
function showAlert(element, message, type) {
  if (!element) return;
  element.textContent = message;
  element.className = `alert alert-${type} show`;
  setTimeout(() => element.classList.remove("show"), 4000);
}

/* EMAIL VALIDATION
   Checks if email has valid format using regex
   Returns true only if email matches pattern */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ANIMATE NUMBER COUNTER
   Smoothly animates a number from 0 to target
   Used to make budget display more interesting
   Runs at 60fps (16ms intervals) */
function animateCounter(element, target, duration = 1000, prefix = "$") {
  let start = 0,
    increment = target / (duration / 16),
    current = start;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = prefix + Math.floor(current).toLocaleString();
  }, 16);
}

/* INITIALIZE SCROLL REVEAL
   Uses IntersectionObserver to detect when elements enter viewport
   Adds animation effect when elements become visible */
function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal-on-scroll");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("revealed");
      });
    },
    { threshold: 0.1 },
  );
  reveals.forEach((r) => observer.observe(r));
}

/* GET DESTINATION OF THE DAY
   Generates same destination for entire day using date-based hash
   Creates predictable but seemingly random selection */
function getDestinationOfTheDay() {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++)
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
  return destinationsData[Math.abs(hash) % destinationsData.length];
}

/* ==================== HOME PAGE ====================
   Initializes features for homepage (index.html)
   - Rotating quotes in hero section
   - Destination of the day display
   ==================== */
function initHome() {
  /* Array of inspirational travel quotes
     Rotates through quotes every 5 seconds */
  const quotes = [
    {
      text: "The world is a book and those who do not travel read only one page.",
      author: "Saint Augustine",
    },
    {
      text: "Travel is the only thing you buy that makes you richer.",
      author: "Anonymous",
    },
    { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
    { text: "To travel is to live.", author: "Hans Christian Andersen" },
    {
      text: "The journey of a thousand miles begins with a single step.",
      author: "Lao Tzu",
    },
  ];
  let idx = 0;
  const quoteEl = document.getElementById("hero-quote");
  /* QUOTE ROTATION: Changes quote every 5 seconds with fade effect */
  if (quoteEl) {
    setInterval(() => {
      idx = (idx + 1) % quotes.length;
      quoteEl.style.opacity = "0";  /* Fade out */
      setTimeout(() => {
        quoteEl.innerHTML = `"${quotes[idx].text}" <span class="hero-quote-author">— ${quotes[idx].author}</span>`;
        quoteEl.style.opacity = "1";  /* Fade in */
      }, 300);
    }, 5000);
  }
  /* DESTINATION OF THE DAY: Gets and displays the day's featured destination */
  const destOfDay = getDestinationOfTheDay();
  const dayName = document.getElementById("dest-day-name");
  const dayDesc = document.getElementById("dest-day-desc");
  if (dayName) dayName.textContent = `${destOfDay.name}, ${destOfDay.country}`;
  if (dayDesc) dayDesc.textContent = destOfDay.description;
}

/* ==================== DESTINATIONS PAGE ====================
   Initializes destination browser with search, filter, and modal
   Features:
   - Display all destinations in grid
   - Search by name/country
   - Filter by continent
   - Modal popup with detailed information
   ==================== */
function initDestinations() {
  /* Get all necessary DOM elements */
  const grid = document.getElementById("destinations-grid");
  const searchInput = document.getElementById("search-input");
  const continentFilter = document.getElementById("continent-filter");
  const modal = document.getElementById("destination-modal");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.getElementById("modal-close");

  /* RENDER DESTINATIONS: Display destinations in grid, add click handlers */
  function renderDestinations(data) {
    /* Convert destination objects to HTML cards */
    grid.innerHTML = data
      .map(
        (dest) => `
      <article class="card" data-id="${dest.id}">
        <img src="${dest.image}" class="card-image" alt="${dest.name}">
        <div class="card-content">
          <h3 class="card-title">${dest.name}, ${dest.country}</h3>
          <p class="card-subtitle">${dest.continent}</p>
        </div>
      </article>
    `,
      )
      .join("");
    
    /* ADD CLICK HANDLERS: Open modal when card is clicked */
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("click", () => {
        const id = parseInt(card.dataset.id);
        const dest = destinationsData.find((d) => d.id === id);
        /* Calculate total daily cost by adding all cost categories */
        const total =
          dest.costs.accommodation +
          dest.costs.food +
          dest.costs.transport +
          dest.costs.activities;
        /* Populate modal with destination details */
        modalBody.innerHTML = `
          <h2>${dest.name}, ${dest.country}</h2>
          <img src="${dest.image}" style="width:100%; height:250px; object-fit:cover; border-radius:8px; margin-bottom:1rem;">
          <p>${dest.description}</p>
          <h3>Popular Attractions</h3>
          <ul>${dest.attractions.map((a) => `<li>${a}</li>`).join("")}</ul>
          <h3>Daily Cost Comparison (USD)</h3>
          <table class="data-table"><thead><tr><th>Category</th><th>Cost</th></tr></thead><tbody>
            <tr><td>Accommodation</td><td>$${dest.costs.accommodation}</td></tr>
            <tr><td>Food</td><td>$${dest.costs.food}</td></tr>
            <tr><td>Transport</td><td>$${dest.costs.transport}</td></tr>
            <tr><td>Activities</td><td>$${dest.costs.activities}</td></tr>
            <tr style="font-weight:700;"><td>Total Daily</td><td>$${total}</td></tr>
          </tbody></table>
        `;
        modal.classList.add("active");
        document.body.style.overflow = "hidden";  /* Prevent background scroll */
      });
    });
  }

  /* FILTER DESTINATIONS: Search and continent filter logic */
  function filterDestinations() {
    const search = searchInput.value.toLowerCase();
    const continent = continentFilter.value;
    /* Filter destinations based on search term AND continent */
    const filtered = destinationsData.filter(
      (d) =>
        (d.name.toLowerCase().includes(search) ||
          d.country.toLowerCase().includes(search)) &&
        (continent === "all" || d.continent === continent),
    );
    renderDestinations(filtered);
  }

  /* INITIALIZE DESTINATIONS PAGE */
  if (grid) {
    renderDestinations(destinationsData);
    /* Add event listeners for filtering */
    searchInput.addEventListener("input", filterDestinations);
    continentFilter.addEventListener("change", filterDestinations);
  }

  /* CLOSE MODAL: Button click */
  if (modalClose)
    modalClose.addEventListener("click", () => {
      modal.classList.remove("active");
      document.body.style.overflow = "";  /* Re-enable background scroll */
    });

  /* CLOSE MODAL: Click outside the modal box */
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

/* ==================== BUDGET PLANNER ====================
   Initializes budget calculation page
   Features:
   - Calculate trip budget based on destination and days
   - Save budgets to browser storage
   - Display cost breakdown and budget status
   - Show progress bar animation
   ==================== */
function initBudget() {
  /* Populate destination dropdown from data */
  const destSelect = document.getElementById("budget-destination");
  if (destSelect) {
    destinationsData.forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = `${d.name}, ${d.country}`;
      destSelect.appendChild(opt);
    });
  }

  /* Get all form and display elements */
  const form = document.getElementById("budget-form");
  const resultDiv = document.getElementById("budget-result");
  const totalSpan = document.getElementById("budget-total");
  const progressBar = document.getElementById("progress-bar");
  const statusP = document.getElementById("budget-status");
  const statusTag = document.getElementById("budget-status-tag");
  const saveBtn = document.getElementById("save-budget-btn");
  const savedListDiv = document.getElementById("saved-budgets");
  const savedContainer = document.getElementById("saved-budgets-list");
  let lastBudget = null;  /* Store most recent calculation for saving */

  /* LOAD SAVED BUDGETS: Display previously saved budgets with delete option */
  function loadSavedBudgets() {
    const saved = getFromLocalStorage("travelnest_budgets");
    if (saved.length) {
      savedListDiv.style.display = "block";
      /* Render each saved budget as a list item */
      savedContainer.innerHTML = saved
        .map(
          (b, i) =>
            `<div class="saved-item"><div><strong>${b.destination}</strong><div style="font-size:0.85rem;">${b.days} days • $${b.total.toLocaleString()}</div></div><button class="saved-item-delete" data-index="${i}">🗑️</button></div>`,
        )
        .join("");
      /* Add delete functionality to each saved budget */
      document.querySelectorAll(".saved-item-delete").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const idx = parseInt(btn.dataset.index);
          const items = getFromLocalStorage("travelnest_budgets");
          items.splice(idx, 1);  /* Remove item at index */
          localStorage.setItem("travelnest_budgets", JSON.stringify(items));
          loadSavedBudgets();  /* Refresh display */
        });
      });
    } else savedListDiv.style.display = "none";
  }

  /* FORM SUBMISSION: Calculate and display budget */
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const destId = parseInt(destSelect.value);
    const days = parseInt(document.getElementById("budget-days").value);
    const daily = parseInt(document.getElementById("budget-daily").value);
    const dest = destinationsData.find((d) => d.id === destId);
    
    /* Validate destination was selected */
    if (!dest) {
      showAlert(
        document.getElementById("budget-alert"),
        "Select destination",
        "error",
      );
      return;
    }

    /* CALCULATE BUDGET */
    const total = days * daily;  /* User's total budget */
    /* Destination's recommended daily cost */
    const destDaily =
      dest.costs.accommodation +
      dest.costs.food +
      dest.costs.transport +
      dest.costs.activities;
    /* Calculate progress bar ratio */
    const ratio = Math.min((total / (days * destDaily)) * 100, 100);

    /* DETERMINE BUDGET STATUS: Low, Moderate, or Luxury */
    let statusClass = "",
      statusText = "";
    if (daily < 50) {
      statusClass = "status-low";
      statusText = "Low Budget";
    } else if (daily < 150) {
      statusClass = "status-moderate";
      statusText = "Moderate Budget";
    } else {
      statusClass = "status-luxury";
      statusText = "Luxury Budget";
    }

    /* DISPLAY RESULTS with animations */
    resultDiv.classList.add("show");
    animateCounter(totalSpan, total, 1500, "$");  /* Animate total */
    setTimeout(() => {
      progressBar.style.width = `${ratio}%`;  /* Animate progress bar */
    }, 100);
    /* Show comparison with destination's recommended budget */
    statusP.textContent = `Estimated daily cost for ${dest.name}: $${destDaily}/day. Your budget: $${daily}/day.`;
    statusTag.className = `status-tag ${statusClass}`;
    statusTag.textContent = statusText;

    /* Save budget for "Save This Budget" button */
    lastBudget = {
      destination: `${dest.name}, ${dest.country}`,
      days,
      daily,
      total,
      date: new Date().toISOString(),
    };
  });

  /* SAVE BUDGET BUTTON: Store current calculation */
  saveBtn?.addEventListener("click", () => {
    if (lastBudget) {
      saveToLocalStorage("travelnest_budgets", lastBudget);
      showAlert(
        document.getElementById("budget-alert"),
        "Budget saved!",
        "success",
      );
      loadSavedBudgets();  /* Refresh saved list */
    }
  });

  /* Initialize: Load any previously saved budgets */
  loadSavedBudgets();
}

/* ==================== RANDOM TRIP ====================
   Random trip generator page
   Features:
   - Generate random destination based on travel type and budget
   - Add destinations to wishlist
   - Display saved wishlist
   ==================== */
function initRandom() {
  /* Get all form and display elements */
  const form = document.getElementById("random-form");
  const resultDiv = document.getElementById("random-result");
  const contentDiv = document.getElementById("random-content");
  const surpriseBtn = document.getElementById("surprise-again");
  const addWishlistBtn = document.getElementById("add-wishlist");
  const wishlistSection = document.getElementById("wishlist-section");
  const wishlistList = document.getElementById("wishlist-list");
  let currentSuggestion = null;  /* Store current random selection */

  /* LOAD WISHLIST: Display saved wishlist items */
  function loadWishlist() {
    const wishlist = getFromLocalStorage("travelnest_wishlist");
    if (wishlist.length) {
      wishlistSection.style.display = "block";
      /* Render each wishlist item */
      wishlistList.innerHTML = wishlist
        .map(
          (w, i) =>
            `<div class="saved-item"><div><strong>${w.name}, ${w.country}</strong></div><button class="saved-item-delete" data-wishidx="${i}">🗑️</button></div>`,
        )
        .join("");
      /* Add delete functionality */
      document.querySelectorAll("[data-wishidx]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const idx = parseInt(btn.dataset.wishidx);
          const items = getFromLocalStorage("travelnest_wishlist");
          items.splice(idx, 1);  /* Remove item */
          localStorage.setItem("travelnest_wishlist", JSON.stringify(items));
          loadWishlist();  /* Refresh display */
        });
      });
    } else wishlistSection.style.display = "none";
  }

  /* GENERATE RANDOM DESTINATION: Find matching destination and display */
  function generateRandom() {
    const type = document.getElementById("travel-type").value;
    const budget = document.getElementById("budget-range").value;
    
    /* Validate selections */
    if (!type || !budget) {
      alert("Please select both travel type and budget range");
      return;
    }

    /* Filter destinations matching criteria */
    const matches = destinationsData.filter(
      (d) => d.type === type && d.budget === budget,
    );

    /* Handle no matches */
    if (matches.length === 0) {
      resultDiv.classList.add("show");
      contentDiv.innerHTML =
        "<p>No destinations match. Try different criteria.</p>";
      addWishlistBtn.style.display = "none";
      return;
    }

    /* Pick random destination from matches */
    const random = matches[Math.floor(Math.random() * matches.length)];
    currentSuggestion = random;  /* Save for wishlist button */
    
    /* Display random destination */
    contentDiv.innerHTML = `
      <h3>${random.name}, ${random.country}</h3>
      <img src="${random.image}" alt="${random.name}" style="width:100%; max-width:400px; border-radius:8px; margin:1rem auto;">
      <p>${random.description}</p>
      <div><span class="status-tag status-moderate">${random.type}</span> <span class="status-tag status-moderate">${random.budget} budget</span></div>
    `;
    resultDiv.classList.add("show");
    addWishlistBtn.style.display = "inline-block";
    addWishlistBtn.disabled = false;
    addWishlistBtn.textContent = "Add to Wishlist ❤️";
  }

  /* FORM SUBMISSION: Generate random trip */
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    generateRandom();
  });

  /* SURPRISE AGAIN BUTTON: Generate another random trip */
  surpriseBtn?.addEventListener("click", generateRandom);

  /* ADD TO WISHLIST BUTTON: Save current suggestion */
  addWishlistBtn?.addEventListener("click", () => {
    if (!currentSuggestion) return;

    /* Check if already in wishlist */
    const exists = getFromLocalStorage("travelnest_wishlist").some(
      (w) => w.id === currentSuggestion.id,
    );
    if (exists) {
      addWishlistBtn.textContent = "Already in Wishlist!";
      addWishlistBtn.disabled = true;
      return;
    }

    /* Add to wishlist */
    saveToLocalStorage("travelnest_wishlist", {
      id: currentSuggestion.id,
      name: currentSuggestion.name,
      country: currentSuggestion.country,
    });
    addWishlistBtn.textContent = "Saved! ✅";
    addWishlistBtn.disabled = true;
    loadWishlist();  /* Refresh wishlist display */
  });

  /* Initialize: Load saved wishlist */
  loadWishlist();
}

/* ==================== MOOD PAGE ====================
   Travel mood page with:
   - Ambient sound player (beach, forest, rain)
   - Destination tracker (visited/planned)
   ==================== */
function initMood() {
  /* Populate destination selector */
  const trackSelect = document.getElementById("track-destination");
  if (trackSelect) {
    destinationsData.forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = `${d.name}, ${d.country}`;
      trackSelect.appendChild(opt);
    });
  }

  /* Get tracker elements */
  const trackBtn = document.getElementById("track-btn");
  const visitedList = document.getElementById("visited-list");
  const plannedList = document.getElementById("planned-list");

  /* LOAD TRACKED DESTINATIONS: Display visited and planned */
  function loadTracked() {
    const visited = getFromLocalStorage("travelnest_visited");
    const planned = getFromLocalStorage("travelnest_planned");
    /* Display visited destinations or empty message */
    visitedList.innerHTML = visited.length
      ? visited
          .map((v) => `<span class="visited-tag">${v.name}</span>`)
          .join("")
      : "<p>No destinations visited yet.</p>";
    /* Display planned destinations or empty message */
    plannedList.innerHTML = planned.length
      ? planned
          .map(
            (p) =>
              `<span class="visited-tag" style="background:var(--accent-secondary);">${p.name}</span>`,
          )
          .join("")
      : "<p>No destinations planned yet.</p>";
  }

  /* TRACK DESTINATION BUTTON: Add to visited or planned list */
  trackBtn?.addEventListener("click", () => {
    const destId = parseInt(trackSelect.value);
    /* Get selected status (visited or planned) */
    const status = document.querySelector(
      'input[name="track-status"]:checked',
    ).value;
    
    if (!destId) {
      alert("Select a destination");
      return;
    }

    const dest = destinationsData.find((d) => d.id === destId);
    /* Determine which storage key to use */
    const key =
      status === "visited" ? "travelnest_visited" : "travelnest_planned";
    
    /* Check if already tracked */
    const existing = getFromLocalStorage(key);
    if (existing.some((e) => e.id === destId)) {
      alert(`${dest.name} already in ${status} list`);
      return;
    }

    /* Save to storage */
    saveToLocalStorage(key, {
      id: dest.id,
      name: `${dest.name}, ${dest.country}`,
    });
    loadTracked();  /* Refresh display */
    trackSelect.value = "";  /* Clear selection */
  });

  /* AMBIENT SOUNDS TOGGLE
     Click to play/pause ambient sounds
     Only one sound plays at a time */
  document.querySelectorAll(".sound-toggle").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const sound = btn.dataset.sound;
      const audio = document.getElementById(`audio-${sound}`);
      
      if (!audio) {
        console.error(`Audio element not found: audio-${sound}`);
        return;
      }

      /* PLAY SOUND */
      if (audio.paused) {
        /* Stop any other playing audio */
        document.querySelectorAll("audio").forEach((a) => {
          a.pause();
          a.currentTime = 0;
        });
        /* Remove active state from all buttons */
        document
          .querySelectorAll(".sound-toggle")
          .forEach((b) => b.classList.remove("active"));
        
        /* Start playing current audio */
        audio.currentTime = 0;
        audio.volume = 0.5;  /* Set volume to 50% */
        setTimeout(() => {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                btn.classList.add("active");
                console.log(`Now playing: ${sound}`);
              })
              .catch((e) => {
                /* Handle playback errors */
                console.error("Audio playback error:", e.name, e.message);
                if (e.name === "NotAllowedError") {
                  alert(
                    "Audio playback blocked by browser policy.\n\nTry:\n1. Clicking the speaker icon in the address bar\n2. Allowing autoplay for this site\n3. Refreshing the page",
                  );
                } else if (e.name === "NotSupportedError") {
                  alert("Audio format not supported by your browser.");
                } else {
                  alert("Audio playback failed: " + e.message);
                }
              });
          } else {
            btn.classList.add("active");
          }
        }, 100);
      } else {
        /* STOP SOUND */
        audio.pause();
        audio.currentTime = 0;
        btn.classList.remove("active");
      }
    });
  });

  /* Initialize: Load saved destinations */
  loadTracked();
}

/* ==================== SUPPORT PAGE ====================
   Feedback form and FAQ accordion
   Features:
   - Collect user feedback (name, email, message)
   - Validate email format
   - Save feedback to browser storage
   - Expandable FAQ sections
   ==================== */
function initSupport() {
  const form = document.getElementById("feedback-form");
  const alertDiv = document.getElementById("feedback-alert");

  if (!form) return; /* Exit if page doesn't have form */

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    /* Get form input values */
    const nameInput = document.getElementById("feedback-name");
    const emailInput = document.getElementById("feedback-email");
    const messageInput = document.getElementById("feedback-message");
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    
    /* VALIDATION: Check all fields are filled */
    if (name === "" || email === "" || message === "") {
      showAlert(alertDiv, "All fields required", "error");
      return;
    }

    /* VALIDATION: Check email format is valid */
    if (!isValidEmail(email)) {
      showAlert(alertDiv, "Valid email required", "error");
      return;
    }

    /* SAVE FEEDBACK: Store in browser storage */
    saveToLocalStorage("travelnest_feedback", {
      name,
      email,
      message,
      date: new Date().toISOString(),
    });

    /* Show success message and clear form */
    showAlert(alertDiv, "Thank you for your feedback!", "success");
    form.reset();
  });

  /* ACCORDION LOGIC: Make FAQ items expandable/collapsible */
  document.querySelectorAll(".accordion-item").forEach((item) => {
    const header = item.querySelector(".accordion-header");
    /* Toggle active class on click */
    header.addEventListener("click", () => {
      item.classList.toggle("active");
    });
  });
}

/* ==================== NEWSLETTER (global) ====================
   Handles newsletter subscription form on all pages
   Validates email and saves to browser storage
   ==================== */
function initNewsletter() {
  /* Get all newsletter forms (multiple pages have it) */
  const forms = document.querySelectorAll("#newsletter-form");
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      /* Get email input value */
      const email = form.querySelector("#newsletter-email").value.trim();
      const alertBox = form.parentElement.querySelector(".alert");
      
      /* VALIDATION: Check email is provided and valid */
      if (!email || !isValidEmail(email)) {
        showAlert(alertBox, "Valid email required", "error");
        return;
      }

      /* SAVE SUBSCRIPTION: Store in browser storage */
      saveToLocalStorage("travelnest_newsletter", {
        email,
        date: new Date().toISOString(),
      });
      
      /* Show success message and clear form */
      showAlert(alertBox, "Subscribed!", "success");
      form.reset();
    });
  });
}

/* ==================== MOBILE NAV ====================
   Hamburger menu toggle for mobile devices
   Opens/closes side navigation menu
   ==================== */
function initMobileNav() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  
  if (hamburger && navLinks) {
    /* HAMBURGER CLICK: Toggle menu open/closed */
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("active");
    });
    
    /* LINK CLICK: Close menu when link is clicked */
    navLinks.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
      }),
    );
  }
}

/* ==================== INITIALIZE ALL ====================
   Main initialization function that runs when page loads
   Detects which page user is on and initializes appropriate features
   ==================== */
document.addEventListener("DOMContentLoaded", () => {
  /* Initialize features that run on ALL pages */
  initMobileNav();      /* Hamburger menu */
  initScrollReveal();   /* Scroll animations */
  initNewsletter();     /* Newsletter subscribe forms */
  initHome();           /* Home page features (quotes, destination of day) */
  
  /* Initialize page-specific features based on URL pathname */
  if (window.location.pathname.includes("destinations.html"))
    initDestinations();
  if (window.location.pathname.includes("budget.html")) initBudget();
  if (window.location.pathname.includes("random.html")) initRandom();
  if (window.location.pathname.includes("mood.html")) initMood();
  if (window.location.pathname.includes("support.html")) initSupport();
  
  /* Alternative: Detect page by checking if specific elements exist
     This works better for direct file access (file:// protocol) */
  if (document.getElementById("destinations-grid")) initDestinations();
  if (document.getElementById("budget-form")) initBudget();
  if (document.getElementById("random-form")) initRandom();
  if (document.getElementById("track-destination")) initMood();
  if (document.getElementById("feedback-form")) initSupport();
});
