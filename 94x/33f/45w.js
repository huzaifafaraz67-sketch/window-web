// Advanced Document Editor (45w)

function getWordAppHTML() {
  return `
    <div class="app-workspace word-suite">
      <div class="app-ribbon word-ribbon">
        <div class="ribbon-group">
          <select class="ribbon-select" onchange="formatDoc('fontName', this.value)">
            <option value="Calibri">Calibri</option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Segoe UI">Segoe UI</option>
          </select>
          <select class="ribbon-select" onchange="formatDoc('fontSize', this.value)">
            <option value="2">10pt</option>
            <option value="3" selected>12pt</option>
            <option value="4">14pt</option>
            <option value="5">18pt</option>
            <option value="6">24pt</option>
            <option value="7">36pt</option>
          </select>
        </div>

        <div class="ribbon-group">
          <button class="ribbon-btn bold" title="Bold" onclick="formatDoc('bold')">B</button>
          <button class="ribbon-btn italic" title="Italic" onclick="formatDoc('italic')">I</button>
          <button class="ribbon-btn" title="Underline" onclick="formatDoc('underline')"><u>U</u></button>
          <button class="ribbon-btn" title="Strikethrough" onclick="formatDoc('strikeThrough')"><s>S</s></button>
        </div>

        <div class="ribbon-group">
          <input type="color" class="ribbon-color" title="Text Color" onchange="formatDoc('foreColor', this.value)" value="#000000">
          <input type="color" class="ribbon-color" title="Highlight Color" onchange="formatDoc('hiliteColor', this.value)" value="#ffffff">
        </div>

        <div class="ribbon-group">
          <button class="ribbon-btn" title="Align Left" onclick="formatDoc('justifyLeft')">⬅</button>
          <button class="ribbon-btn" title="Align Center" onclick="formatDoc('justifyCenter')">↔</button>
          <button class="ribbon-btn" title="Align Right" onclick="formatDoc('justifyRight')">➡</button>
          <button class="ribbon-btn" title="Justify" onclick="formatDoc('justifyFull')">☰</button>
        </div>

        <div class="ribbon-group">
          <button class="ribbon-btn" title="Bullet List" onclick="formatDoc('insertUnorderedList')">• List</button>
          <button class="ribbon-btn" title="Numbered List" onclick="formatDoc('insertOrderedList')">1. List</button>
          <button class="ribbon-btn" title="Quote Block" onclick="formatDoc('formatBlock', 'blockquote')">""</button>
        </div>

        <div class="ribbon-group">
          <button class="ribbon-btn" onclick="saveWordDoc()">💾 Save</button>
          <button class="ribbon-btn" onclick="exportWordDoc()">📥 Export HTML</button>
          <button class="ribbon-btn" onclick="clearWordDoc()">🗑️ Clear</button>
        </div>
      </div>

      <div class="app-canvas doc-canvas">
        <div class="doc-page">
          <div id="word-editor-body" class="doc-editor" contenteditable="true" spellcheck="false" oninput="updateWordStats()">
            <h1>Untitled Document</h1>
            <p>Start typing your document text here...</p>
          </div>
        </div>
      </div>

      <div class="doc-statusbar">
        <span id="doc-word-count">Words: 0</span>
        <span id="doc-char-count">Characters: 0</span>
        <span>UTF-8 Document Mode</span>
      </div>
    </div>
  `;
}

function formatDoc(cmd, value = null) {
  document.execCommand(cmd, false, value);
  updateWordStats();
}

function initWordApp() {
  const savedContent = localStorage.getItem('45w_doc_data');
  const editor = document.getElementById('word-editor-body');
  if (editor && savedContent) {
    editor.innerHTML = savedContent;
  }
  updateWordStats();
}

function updateWordStats() {
  const editor = document.getElementById('word-editor-body');
  if (!editor) return;

  const text = editor.innerText || '';
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;

  const wordEl = document.getElementById('doc-word-count');
  const charEl = document.getElementById('doc-char-count');
  if (wordEl) wordEl.innerText = `Words: ${words}`;
  if (charEl) charEl.innerText = `Characters: ${chars}`;
}

function saveWordDoc() {
  const editor = document.getElementById('word-editor-body');
  if (editor) {
    localStorage.setItem('45w_doc_data', editor.innerHTML);
    alert('Document saved to Web OS LocalStorage!');
  }
}

function exportWordDoc() {
  const editor = document.getElementById('word-editor-body');
  if (!editor) return;

  const blob = new Blob([editor.innerHTML], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'document-45w.html';
  a.click();
}

function clearWordDoc() {
  const editor = document.getElementById('word-editor-body');
  if (editor && confirm('Are you sure you want to clear the document?')) {
    editor.innerHTML = '<h1>New Document</h1><p></p>';
    updateWordStats();
  }
}
