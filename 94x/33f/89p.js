// Advanced Presentation Deck Engine (89p)

let presentationDeck = [
  { title: "Welcome to SlideDeck 89p", subtitle: "Interactive Presentation Engine", bg: "#ffffff" },
  { title: "Key Features", subtitle: "• Multi-slide engine\n• Custom layouts\n• Theme switching", bg: "#f0f4f8" }
];

let activeSlideIndex = 0;

function getPPTAppHTML() {
  return `
    <div class="app-workspace ppt-suite">
      <div class="app-ribbon ppt-ribbon">
        <div class="ribbon-group">
          <button class="ribbon-btn" onclick="addNewSlide()">➕ Add Slide</button>
          <button class="ribbon-btn" onclick="deleteCurrentSlide()">🗑️ Delete Slide</button>
        </div>

        <div class="ribbon-group">
          <span class="ribbon-label">Theme BG:</span>
          <button class="ribbon-btn" onclick="applySlideBg('#ffffff')">White</button>
          <button class="ribbon-btn" onclick="applySlideBg('#f0f4f8')">Ice Blue</button>
          <button class="ribbon-btn" onclick="applySlideBg('#fff4e6')">Peach</button>
          <button class="ribbon-btn" onclick="applySlideBg('#1e293b')">Dark</button>
        </div>

        <div class="ribbon-group">
          <button class="ribbon-btn" onclick="togglePresentationMode()">▶️ Present</button>
          <button class="ribbon-btn" onclick="saveDeck()">💾 Save Deck</button>
          <button class="ribbon-btn" onclick="exportDeckJSON()">📥 Export JSON</button>
        </div>
      </div>

      <div class="app-canvas ppt-layout">
        <!-- Left Sidebar: Slide Thumbnails -->
        <div class="slide-sidebar" id="slide-thumb-list"></div>

        <!-- Main Slide View Canvas -->
        <div class="slide-editor-stage">
          <div class="slide-canvas" id="ppt-active-slide-frame">
            <input type="text" id="ppt-slide-title-input" class="slide-title-input"
              placeholder="Click to Add Title" oninput="updateSlideContent()">
            <textarea id="ppt-slide-body-input" class="slide-body-input"
              placeholder="Click to Add Body Text" oninput="updateSlideContent()"></textarea>
          </div>
        </div>
      </div>

      <div class="doc-statusbar">
        <span id="ppt-slide-status">Slide 1 of 1</span>
        <span>16:9 Widescreen</span>
      </div>
    </div>
  `;
}

function initPPTApp() {
  const savedDeck = localStorage.getItem('89p_deck_data');
  if (savedDeck) {
    try {
      presentationDeck = JSON.parse(savedDeck);
    } catch (e) {
      console.error('Failed loading deck:', e);
    }
  }
  renderSlideThumbs();
  loadSlideIntoCanvas(0);
}

function renderSlideThumbs() {
  const thumbContainer = document.getElementById('slide-thumb-list');
  if (!thumbContainer) return;

  thumbContainer.innerHTML = '';
  presentationDeck.forEach((slide, index) => {
    const thumb = document.createElement('div');
    thumb.className = `slide-thumb ${index === activeSlideIndex ? 'active' : ''}`;
    thumb.onclick = () => loadSlideIntoCanvas(index);
    thumb.innerHTML = `
      <span class="thumb-idx">${index + 1}</span>
      <div class="thumb-preview" style="background: ${slide.bg || '#ffffff'};">
        <div class="thumb-title">${slide.title || 'Untitled'}</div>
      </div>
    `;
    thumbContainer.appendChild(thumb);
  });

  const statusEl = document.getElementById('ppt-slide-status');
  if (statusEl) {
    statusEl.innerText = `Slide ${activeSlideIndex + 1} of ${presentationDeck.length}`;
  }
}

function loadSlideIntoCanvas(index) {
  if (index < 0 || index >= presentationDeck.length) return;
  activeSlideIndex = index;

  const slide = presentationDeck[index];
  const frame = document.getElementById('ppt-active-slide-frame');
  const titleInput = document.getElementById('ppt-slide-title-input');
  const bodyInput = document.getElementById('ppt-slide-body-input');

  if (frame && titleInput && bodyInput) {
    frame.style.backgroundColor = slide.bg || '#ffffff';
    titleInput.value = slide.title || '';
    bodyInput.value = slide.subtitle || '';

    // Adjust text contrast for dark background
    const isDark = slide.bg === '#1e293b';
    titleInput.style.color = isDark ? '#ffffff' : '#111111';
    bodyInput.style.color = isDark ? '#cbd5e1' : '#444444';
  }

  renderSlideThumbs();
}

function updateSlideContent() {
  const titleInput = document.getElementById('ppt-slide-title-input');
  const bodyInput = document.getElementById('ppt-slide-body-input');

  if (presentationDeck[activeSlideIndex]) {
    presentationDeck[activeSlideIndex].title = titleInput.value;
    presentationDeck[activeSlideIndex].subtitle = bodyInput.value;
  }
  renderSlideThumbs();
}

function applySlideBg(color) {
  if (presentationDeck[activeSlideIndex]) {
    presentationDeck[activeSlideIndex].bg = color;
    loadSlideIntoCanvas(activeSlideIndex);
  }
}

function addNewSlide() {
  presentationDeck.push({
    title: "New Slide Title",
    subtitle: "Click to add text",
    bg: "#ffffff"
  });
  loadSlideIntoCanvas(presentationDeck.length - 1);
}

function deleteCurrentSlide() {
  if (presentationDeck.length <= 1) {
    alert("Cannot delete the only slide!");
    return;
  }
  presentationDeck.splice(activeSlideIndex, 1);
  activeSlideIndex = Math.max(0, activeSlideIndex - 1);
  loadSlideIntoCanvas(activeSlideIndex);
}

function togglePresentationMode() {
  const frame = document.getElementById('ppt-active-slide-frame');
  if (!frame) return;

  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    frame.requestFullscreen().catch(err => {
      alert(`Error starting fullscreen mode: ${err.message}`);
    });
  }
}

function saveDeck() {
  localStorage.setItem('89p_deck_data', JSON.stringify(presentationDeck));
  alert('Presentation deck saved!');
}

function exportDeckJSON() {
  const blob = new Blob([JSON.stringify(presentationDeck, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'presentation-89p.json';
  a.click();
}
