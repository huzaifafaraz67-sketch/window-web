// Advanced Window Manager & LocalStorage Engine (02b)

let topZIndex = 100;

function openWindow(winId) {
  const container = document.getElementById('window-container');
  let win = document.getElementById(winId);

  if (!win) {
    win = document.createElement('div');
    win.id = winId;
    win.className = 'win-frame';
    
    // Store original size & position for maximize/restore tracking
    win.dataset.maximized = "false";
    win.dataset.prevTop = "60px";
    win.dataset.prevLeft = "100px";
    win.dataset.prevWidth = "640px";
    win.dataset.prevHeight = "440px";

    const offset = (container.children.length * 25) % 120;
    win.style.top = `${60 + offset}px`;
    win.style.left = `${100 + offset}px`;

    let title = 'Application';
    let bodyContent = '';

    if (winId === 'word-window') {
      title = 'Word Document (45w)';
      bodyContent = getWordAppHTML();
    } else if (winId === 'excel-window') {
      title = 'Excel Sheet (67x)';
      bodyContent = getExcelAppHTML();
    } else if (winId === 'ppt-window') {
      title = 'PowerPoint Presentation (89p)';
      bodyContent = getPPTAppHTML();
    }

    win.innerHTML = `
      <div class="win-header" onmousedown="dragWindow(event, '${winId}')" ondblclick="toggleMaximize('${winId}')">
        <div class="win-title">${title}</div>
        <div class="win-controls">
          <button class="win-btn" onclick="minimizeWindow('${winId}')">─</button>
          <button class="win-btn" onclick="toggleMaximize('${winId}')">▢</button>
          <button class="win-btn close" onclick="closeWindow('${winId}')">✕</button>
        </div>
      </div>
      <div class="win-body">${bodyContent}</div>
    `;

    container.appendChild(win);

    if (winId === 'word-window' && typeof initWordApp === 'function') initWordApp();
    if (winId === 'excel-window' && typeof initExcelApp === 'function') initExcelApp();
  }

  if (win.style.display === 'none') {
    win.style.display = 'flex';
  }
  
  focusWindow(winId);
  addTaskbarTab(winId, win.querySelector('.win-title').innerText);
}

// Bring Window to Front and Highlight Active State
function focusWindow(winId) {
  document.querySelectorAll('.win-frame').forEach(w => w.classList.remove('active-frame'));
  const win = document.getElementById(winId);
  if (win) {
    topZIndex++;
    win.style.zIndex = topZIndex;
    win.classList.add('active-frame');

    document.querySelectorAll('.taskbar-tab').forEach(tab => tab.classList.remove('active'));
    const tab = document.getElementById(`tab-${winId}`);
    if (tab) tab.classList.add('active');
  }
}

// Maximize / Restore Toggle
function toggleMaximize(winId) {
  const win = document.getElementById(winId);
  if (!win) return;

  if (win.dataset.maximized === "true") {
    // Restore previous geometry
    win.style.top = win.dataset.prevTop;
    win.style.left = win.dataset.prevLeft;
    win.style.width = win.dataset.prevWidth;
    win.style.height = win.dataset.prevHeight;
    win.dataset.maximized = "false";
    win.classList.remove('maximized');
  } else {
    // Save current geometry and expand to fill screen
    win.dataset.prevTop = win.style.top;
    win.dataset.prevLeft = win.style.left;
    win.dataset.prevWidth = `${win.offsetWidth}px`;
    win.dataset.prevHeight = `${win.offsetHeight}px`;

    win.style.top = '0px';
    win.style.left = '0px';
    win.style.width = '100vw';
    win.style.height = 'calc(100vh - 40px)';
    win.dataset.maximized = "true";
    win.classList.add('maximized');
  }
}

// Minimize Window
function minimizeWindow(winId) {
  const win = document.getElementById(winId);
  if (win) {
    win.style.display = 'none';
    const tab = document.getElementById(`tab-${winId}`);
    if (tab) tab.classList.remove('active');
  }
}

// Close Window
function closeWindow(winId) {
  const win = document.getElementById(winId);
  if (win) {
    win.remove();
    removeTaskbarTab(winId);
  }
}

// Draggable Window Handler with Maximize Check
function dragWindow(e, winId) {
  const win = document.getElementById(winId);
  if (win.dataset.maximized === "true") return;

  e.preventDefault();
  focusWindow(winId);

  let shiftX = e.clientX - win.getBoundingClientRect().left;
  let shiftY = e.clientY - win.getBoundingClientRect().top;

  function moveAt(pageX, pageY) {
    win.style.left = `${pageX - shiftX}px`;
    win.style.top = `${pageY - shiftY}px`;
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  document.addEventListener('mousemove', onMouseMove);

  document.onmouseup = function() {
    document.removeEventListener('mousemove', onMouseMove);
    document.onmouseup = null;
  };
}
