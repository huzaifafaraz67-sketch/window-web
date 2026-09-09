// PowerPoint App Engine (89p)

let currentSlideColor = '#ffffff';

function getPPTAppHTML() {
  return `
    <div class="app-workspace">
      <div class="app-ribbon">
        <button class="ribbon-btn" onclick="addSampleSlide()">+ New Slide Title</button>
        <button class="ribbon-btn" onclick="setSlideBg('#ffffff')">White BG</button>
        <button class="ribbon-btn" onclick="setSlideBg('#f0f4f8')">Light Blue BG</button>
        <button class="ribbon-btn" onclick="setSlideBg('#fff4e6')">Warm BG</button>
      </div>
      <div class="app-canvas slide-workspace">
        <div class="slide-canvas" id="active-slide">
          <input type="text" class="slide-title-input" value="Click to Add Title" />
          <div contenteditable="true" style="outline: none; font-size: 14px; color: #666666; width: 100%; text-align: center;">
            Click to add subtitle or slide details
          </div>
        </div>
      </div>
    </div>
  `;
}

function setSlideBg(color) {
  const slide = document.getElementById('active-slide');
  if (slide) {
    slide.style.backgroundColor = color;
  }
}

function addSampleSlide() {
  const slideTitle = document.querySelector('.slide-title-input');
  if (slideTitle) {
    slideTitle.value = "New Slide Topic";
  }
}
