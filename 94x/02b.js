// Window Manager Engine

let topZIndex = 100;

// Open or Focus a Window
function openWindow(winId) {
  const container = document.getElementById('window-container');
  let win = document.getElementById(winId);

  // If window doesn't exist, build it dynamically based on ID
  if (!win) {
    win = document.createElement('div');
    win.id = winId;
    win.className = 'win-frame';
    
    // Stagger window positions slightly
    const offset = (container.children.length * 20) % 100;
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
      <div class="win-header" onmousedown="dragWindow(event, '${winId}')">
        <div class="win-title">${title}</div>
        <div class="win-controls">
          <button class="win-btn" onclick="minimizeWindow('${winId}')">─</button>
          <button class="win-btn close" onclick="closeWindow('${winId}')">✕</button>
        </div>
      </div>
      <div class="win-body">${bodyContent}</div>
    `;

    container.appendChild(win);
    
    // Trigger initialization scripts for specific app
    if (winId === 'word-window' && typeof initWordApp === 'function') initWordApp();
    if (winId === 'excel-window' && typeof initExcelApp === 'function') initExcelApp();
  }

  // Show and update focus depth
  win.style.display = 'flex';
  focusWindow(winId);
  addTaskbarTab(winId, win.querySelector('.win-title').innerText);
}

// Bring Window to Front
function focusWindow(winId) {
  const win = document.getElementById(winId);
  if (win) {
    topZIndex++;
    win.style.zIndex = topZIndex;
    
    // Update active state on taskbar tabs
    document.querySelectorAll('.taskbar-tab').forEach(tab => tab.classList.remove('active'));
    const tab = document.getElementById(`tab-${winId}`);
    if (tab) tab.classList.add('active');
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

// Draggable Window Functionality
function dragWindow(e, winId) {
  e.preventDefault();
  focusWindow(winId);

  const win = document.getElementById(winId);
  let shiftX = e.clientX - win.getBoundingClientRect().left;
  let shiftY = e.clientY - win.getBoundingClientRect().top;

  function moveAt(pageX, pageY) {
    win.style.left = pageX - shiftX + 'px';
    win.style.top = pageY - shiftY + 'px';
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
