\// script.js (Norvak Style Edition)

function addEntryRow() {
  const area = document.getElementById('upc-entry-area');
  const upcGroup = document.createElement('div');
  upcGroup.classList.add('entry-group');
  upcGroup.innerHTML = `
    <input type="text" class="upc norvak-input" placeholder="UPC">
    <input type="number" class="found norvak-input" placeholder="Found">
    <input type="number" class="expected norvak-input" placeholder="System">
    <textarea class="notes norvak-input" placeholder="Notes" rows="2"></textarea>
  `;
  area.appendChild(upcGroup);
}

function logAllEntries() {
  const location = document.getElementById('location').value;
  const upcs = document.querySelectorAll('.upc');
  const founds = document.querySelectorAll('.found');
  const expecteds = document.querySelectorAll('.expected');
  const notesArr = document.querySelectorAll('.notes');

  for (let i = 0; i < upcs.length; i++) {
    const upc = upcs[i].value.trim();
    const found = parseInt(founds[i].value) || 0;
    const expected = parseInt(expecteds[i].value) || 0;
    const notes = notesArr[i].value.trim();
    const discrepancy = found - expected;
    const timestamp = new Date().toLocaleString();

    if (!upc) continue;

    const table = document.getElementById('logTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    newRow.innerHTML = `
      <td>${timestamp}</td>
      <td>${location}</td>
      <td>${upc}</td>
      <td>${found}</td>
      <td>${expected}</td>
      <td style="color:${discrepancy === 0 ? '#00ff88' : '#ff3366'}; font-weight:bold;">${discrepancy}</td>
      <td>${notes}</td>
    `;
  }
  saveToLocalStorage();
  document.getElementById('upc-entry-area').innerHTML = '';
  addEntryRow();
}

function exportTableToCSV() {
  const table = document.getElementById("logTable");
  const rows = Array.from(table.querySelectorAll("tr"));
  const csv = rows.map(row => {
    const cells = Array.from(row.querySelectorAll("th, td"));
    return cells.map(cell => '"' + cell.innerText + '"').join(",");
  }).join("\n");

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'norvak_inventory_log.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function saveToLocalStorage() {
  const table = document.getElementById("logTable").innerHTML;
  localStorage.setItem("inventoryLogTable", table);
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem("inventoryLogTable");
  if (saved) {
    const shouldRestore = confirm("Load previous log from Norvak system?");
    if (shouldRestore) {
      document.getElementById("logTable").innerHTML = saved;
    } else {
      localStorage.removeItem("inventoryLogTable");
    }
  }
}

function filterTable() {
  const input = document.getElementById("filter");
  const filter = input.value.toLowerCase();
  const rows = document.getElementById("logTable").getElementsByTagName("tr");

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(filter) ? "" : "none";
  }
}

window.onload = function () {
  loadFromLocalStorage();
  addEntryRow();
};

