// Advanced Spreadsheet Engine (67x)

const EXCEL_ROWS = 40;
const EXCEL_COLS = 16; // A to P

function getExcelAppHTML() {
  let tableHTML = '<table class="sheet-table" id="sheet-matrix"><thead><tr><th></th>';

  for (let c = 0; c < EXCEL_COLS; c++) {
    const colName = String.fromCharCode(65 + c);
    tableHTML += `<th data-col="${colName}">${colName}</th>`;
  }
  tableHTML += '</tr></thead><tbody>';

  for (let r = 1; r <= EXCEL_ROWS; r++) {
    tableHTML += `<tr><th class="row-header">${r}</th>`;
    for (let c = 0; c < EXCEL_COLS; c++) {
      const colName = String.fromCharCode(65 + c);
      const cellId = `${colName}${r}`;
      tableHTML += `
        <td data-cell-id="${cellId}">
          <input type="text" id="cell-${cellId}" data-cell="${cellId}"
            onfocus="onCellFocus('${cellId}')"
            onblur="onCellBlur('${cellId}')"
            onkeydown="onCellKeyDown(event, '${cellId}', ${r}, ${c})" />
        </td>`;
    }
    tableHTML += '</tr>';
  }

  tableHTML += '</tbody></table>';

  return `
    <div class="app-workspace excel-suite">
      <div class="app-ribbon excel-ribbon">
        <div class="ribbon-group">
          <button class="ribbon-btn" onclick="recalculateSheet()">🔄 Recalculate</button>
          <button class="ribbon-btn" onclick="saveExcelSheet()">💾 Save Sheet</button>
          <button class="ribbon-btn" onclick="exportCSV()">📥 Export CSV</button>
          <button class="ribbon-btn" onclick="clearSheet()">🗑️ Clear Grid</button>
        </div>
        <div class="ribbon-group">
          <span class="ribbon-label">Cell Reference:</span>
          <input type="text" id="active-cell-ref" class="cell-ref-box" readonly value="A1">
        </div>
      </div>

      <div class="formula-bar-container">
        <span class="formula-fx">fx</span>
        <input type="text" id="formula-bar-input" class="formula-input" placeholder="Enter value or formula (e.g. =SUM(A1:A5))" oninput="syncFormulaToActiveCell(this.value)">
      </div>

      <div class="app-canvas sheet-grid-container">
        ${tableHTML}
      </div>

      <div class="doc-statusbar">
        <span id="sheet-status">Ready</span>
        <span>Sheet Size: ${EXCEL_ROWS}x${EXCEL_COLS}</span>
      </div>
    </div>
  `;
}

let activeCellId = 'A1';
const rawCellData = {};

function initExcelApp() {
  const savedData = localStorage.getItem('67x_sheet_data');
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      Object.assign(rawCellData, parsed);
      for (const [cellId, val] of Object.entries(rawCellData)) {
        const input = document.getElementById(`cell-${cellId}`);
        if (input) input.value = val;
      }
      recalculateSheet();
    } catch (e) {
      console.error('Failed to load sheet data:', e);
    }
  }
}

function onCellFocus(cellId) {
  activeCellId = cellId;
  document.getElementById('active-cell-ref').value = cellId;
  const formulaInput = document.getElementById('formula-bar-input');
  formulaInput.value = rawCellData[cellId] || '';
}

function onCellBlur(cellId) {
  const input = document.getElementById(`cell-${cellId}`);
  if (!input) return;

  rawCellData[cellId] = input.value;
  recalculateSheet();
}

function syncFormulaToActiveCell(val) {
  if (!activeCellId) return;
  const input = document.getElementById(`cell-${activeCellId}`);
  if (input) {
    input.value = val;
    rawCellData[activeCellId] = val;
  }
}

function onCellKeyDown(e, cellId, r, c) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const nextRow = r + 1;
    const nextCell = document.getElementById(`cell-${String.fromCharCode(65 + c)}${nextRow}`);
    if (nextCell) nextCell.focus();
  }
}

function parseRangeValues(rangeStr) {
  const parts = rangeStr.split(':');
  if (parts.length !== 2) return [];

  const startCol = parts[0].replace(/[0-9]/g, '').toUpperCase();
  const startRow = parseInt(parts[0].replace(/\D/g, ''), 10);
  const endCol = parts[1].replace(/[0-9]/g, '').toUpperCase();
  const endRow = parseInt(parts[1].replace(/\D/g, ''), 10);

  const startColCode = startCol.charCodeAt(0);
  const endColCode = endCol.charCodeAt(0);

  const values = [];

  for (let c = startColCode; c <= endColCode; c++) {
    for (let r = startRow; r <= endRow; r++) {
      const cellRef = `${String.fromCharCode(c)}${r}`;
      const val = parseFloat(getComputedCellValue(cellRef));
      if (!isNaN(val)) values.push(val);
    }
  }
  return values;
}

function getComputedCellValue(cellRef) {
  const raw = rawCellData[cellRef] || '';
  if (!raw.startsWith('=')) return raw;
  return evaluateFormula(raw);
}

function evaluateFormula(formulaStr) {
  const expr = formulaStr.substring(1).trim().toUpperCase();

  try {
    if (expr.startsWith('SUM(')) {
      const range = expr.replace('SUM(', '').replace(')', '');
      const nums = parseRangeValues(range);
      return nums.reduce((a, b) => a + b, 0);
    }
    if (expr.startsWith('AVERAGE(')) {
      const range = expr.replace('AVERAGE(', '').replace(')', '');
      const nums = parseRangeValues(range);
      return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
    }
    if (expr.startsWith('MAX(')) {
      const range = expr.replace('MAX(', '').replace(')', '');
      const nums = parseRangeValues(range);
      return nums.length ? Math.max(...nums) : 0;
    }
    if (expr.startsWith('MIN(')) {
      const range = expr.replace('MIN(', '').replace(')', '');
      const nums = parseRangeValues(range);
      return nums.length ? Math.min(...nums) : 0;
    }

    // Direct cell reference substitution (e.g. =A1+B1)
    const sanitized = expr.replace(/([A-P][0-9]+)/g, (match) => {
      const val = parseFloat(getComputedCellValue(match));
      return isNaN(val) ? 0 : val;
    });

    return Function(`"use strict"; return (${sanitized})`)();
  } catch (err) {
    return '#ERROR!';
  }
}

function recalculateSheet() {
  for (const [cellId, rawVal] of Object.entries(rawCellData)) {
    const input = document.getElementById(`cell-${cellId}`);
    if (!input) continue;

    if (String(rawVal).startsWith('=')) {
      input.value = evaluateFormula(rawVal);
    } else {
      input.value = rawVal;
    }
  }
}

function saveExcelSheet() {
  localStorage.setItem('67x_sheet_data', JSON.stringify(rawCellData));
  alert('Spreadsheet saved!');
}

function exportCSV() {
  let csv = '';
  for (let r = 1; r <= EXCEL_ROWS; r++) {
    const rowVals = [];
    for (let c = 0; c < EXCEL_COLS; c++) {
      const cellId = `${String.fromCharCode(65 + c)}${r}`;
      const input = document.getElementById(`cell-${cellId}`);
      rowVals.push(`"${input ? input.value : ''}"`);
    }
    csv += rowVals.join(',') + '\n';
  }

  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'sheet-67x.csv';
  a.click();
}

function clearSheet() {
  if (confirm('Clear all spreadsheet cells?')) {
    Object.keys(rawCellData).forEach(k => delete rawCellData[k]);
    document.querySelectorAll('.sheet-table input').forEach(inp => inp.value = '');
    localStorage.removeItem('67x_sheet_data');
  }
}
