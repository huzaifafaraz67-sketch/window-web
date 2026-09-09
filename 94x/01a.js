// System Initialization & Clock Management

document.addEventListener('DOMContentLoaded', () => {
  // Start system clock
  updateClock();
  setInterval(updateClock, 1000);

  // Close start menu when clicking on desktop
  document.getElementById('desktop').addEventListener('click', () => {
    const startMenu = document.getElementById('start-menu');
    if (!startMenu.classList.contains('hidden')) {
      startMenu.classList.add('hidden');
    }
  });
});

// Update System Tray Clock
function updateClock() {
  const clockElement = document.getElementById('clock');
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // convert 0 to 12

  clockElement.textContent = `${hours}:${minutes} ${ampm}`;
}

// Toggle Start Menu
function toggleStartMenu() {
  const startMenu = document.getElementById('start-menu');
  startMenu.classList.toggle('hidden');
}

// Add app tab to taskbar
function addTaskbarTab(id, title) {
  const container = document.getElementById('taskbar-apps');
  let tab = document.getElementById(`tab-${id}`);

  if (!tab) {
    tab = document.createElement('button');
    tab.id = `tab-${id}`;
    tab.className = 'taskbar-tab active';
    tab.innerText = title;
    tab.onclick = () => focusWindow(id);
    container.appendChild(tab);
  }
}

// Remove app tab from taskbar
function removeTaskbarTab(id) {
  const tab = document.getElementById(`tab-${id}`);
  if (tab) {
    tab.remove();
  }
}
