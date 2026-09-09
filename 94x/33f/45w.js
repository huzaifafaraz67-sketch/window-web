// Word App Engine (45w)

function getWordAppHTML() {
  return `
    <div class="app-workspace">
      <div class="app-ribbon">
        <button class="ribbon-btn bold" onclick="formatDoc('bold')">B</button>
        <button class="ribbon-btn italic" onclick="formatDoc('italic')">I</button>
        <button class="ribbon-btn" onclick="formatDoc('underline')"><u>U</u></button>
        <button class="ribbon-btn" onclick="formatDoc('justifyLeft')">Left</button>
        <button class="ribbon-btn" onclick="formatDoc('justifyCenter')">Center</button>
        <button class="ribbon-btn" onclick="formatDoc('justifyRight')">Right</button>
      </div>
      <div class="app-canvas">
        <div class="doc-editor" contenteditable="true" spellcheck="false">
          Welcome to Word Clone (45w). Start typing your document here...
        </div>
      </div>
    </div>
  `;
}

function formatDoc(cmd, value = null) {
  document.execCommand(cmd, false, value);
}

function initWordApp() {
  // Add custom event listeners or default focus actions if needed
  const editor = document.querySelector('.doc-editor');
  if (editor) {
    editor.focus();
  }
}
