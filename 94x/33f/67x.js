// Excel App Engine (67x)

function getExcelAppHTML() {
  let tableHTML = '<table class="sheet-table"><thead><tr><th></th>';

  // Generate Column Headers (A to Z)
  for (let c = 0; c < 10; c++) {
    const colName = String.fromCharCode(65 + c);
    tableHTML += `<th>${colName}</th>`;
  }
  tableHTML += '</tr></thead><tbody>';

  // Generate 20 Rows
  for (let r = 1; r <= 20; r++) {
    tableHTML += `<tr><th>${r}</th>`;
    for (let c = 0; c < 10; c++) {
      const colName = String.fromCharCode(65 + c);
      const cellId = `${colName}${r}`;
      tableHTML += `<td><input type="text" id="cell-${cellId}" data-cell="${cellId}" onblur="calculateCell('${cellId}')" /></td>`;
    }
    tableHTML += '</tr>';
  }

  tableHTML += '</tbody></table>';

  return `
    <div class="app-workspace">
      <div class="app-ribbon">
        <button class="ribbon-btn" onclick="clearSheet()">Clear All</button>
      </div>
      <div class="app-canvas sheet-grid-container">
        ${tableHTML}
      </div>
    </div>
  `;
}

function initExcelApp() {
  // Ready for event bindings
}

// Basic Math Formula Support (=1+1 or =SUM/AVG)
function calculateCell(cellId) {
  const input = document.getElementById(`cell-${cellId}`);
  if (!input) return;

  let val = input.value.trim();

  if (val.startsWith('=')) {
    try {
      // Basic math evaluation for formulas starting with '='
      const expr = val.substring(1);
      const result = Function(`"use strict"; return (${expr})`)();
      input.value = result;
    } catch (e) {
      input.value = '#ERROR!';
    }
  }
}

function clearSheet() {
  const inputs = document.querySelectorAll('.sheet-table input');
  inputs.forEach(input => input.value = '');
}
