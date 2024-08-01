// script.js
const chemicals = [
  { name: "Water", iupacName: "Oxidane", casNumber: "7732-18-5", meltingPoint: 0, boilingPoint: 100, molecularWeight: 18.01528, pictograms: [] },
  { name: "Ethanol", iupacName: "Ethanol", casNumber: "64-17-5", meltingPoint: -114.1, boilingPoint: 78.37, molecularWeight: 46.06844, pictograms: ["GHS02", "GHS07"] },
  { name: "Sodium chloride", iupacName: "Sodium chloride", casNumber: "7647-14-5", meltingPoint: 801, boilingPoint: 1413, molecularWeight: 58.44, pictograms: [] },
  { name: "Acetic acid", iupacName: "Ethanoic acid", casNumber: "64-19-7", meltingPoint: 16.6, boilingPoint: 118.1, molecularWeight: 60.052, pictograms: ["GHS02", "GHS05"] },
  { name: "Hydrogen peroxide", iupacName: "Hydrogen peroxide", casNumber: "7722-84-1", meltingPoint: -0.43, boilingPoint: 150.2, molecularWeight: 34.0147, pictograms: ["GHS03", "GHS05", "GHS07"] },
  { name: "Methane", iupacName: "Methane", casNumber: "74-82-8", meltingPoint: -182.5, boilingPoint: -161.5, molecularWeight: 16.04, pictograms: ["GHS02", "GHS04"] },
  { name: "Carbon dioxide", iupacName: "Carbon dioxide", casNumber: "124-38-9", meltingPoint: -78.5, boilingPoint: -78.5, molecularWeight: 44.01, pictograms: ["GHS04"] }
];

// Populate chemicals table in index.html
function populateChemicalsTable() {
  const tableBody = document.querySelector('#chemicalsTable tbody');
  const searchInput = document.getElementById('searchInput');

  function populateTable(filteredChemicals) {
    tableBody.innerHTML = '';
    filteredChemicals.forEach(chemical => {
      const row = document.createElement('tr');
      const pictogramsHTML = chemical.pictograms.map(pic => `<img src="images/${pic}.png" alt="${pic}" width="32" height="32">`).join(' ');
      row.innerHTML = `
        <td><a href="batch.html?chemical=${encodeURIComponent(chemical.name)}">${chemical.name}</a></td>
        <td>${chemical.iupacName}</td>
        <td>${chemical.casNumber}</td>
        <td>${chemical.meltingPoint}</td>
        <td>${chemical.boilingPoint}</td>
        <td>${chemical.molecularWeight}</td>
        <td>${pictogramsHTML}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  function filterChemicals() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredChemicals = chemicals.filter(chemical =>
      chemical.name.toLowerCase().includes(searchTerm) ||
      chemical.casNumber.includes(searchTerm)
    );
    populateTable(filteredChemicals);
  }

  searchInput.addEventListener('input', filterChemicals);

  // Initial population of the table
  populateTable(chemicals);
}

// Batch page functionality (batch.html)
function setupBatchPage() {
  document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const chemicalName = urlParams.get('chemical');
    document.getElementById('chemicalName').textContent = chemicalName;

    const pictogramsContainer = document.getElementById('hazardPictograms');
    const pictograms = chemicals.find(chem => chem.name === chemicalName)?.pictograms || [];
    const pictogramsHTML = pictograms.map(pic => `<img src="images/${pic}.png" alt="${pic}">`).join(' ');
    pictogramsContainer.innerHTML = pictogramsHTML;

    const batchesKey = `batches_${chemicalName}`;
    let batches = JSON.parse(localStorage.getItem(batchesKey)) || [];

    const tableBody = document.querySelector('#batchesTable tbody');
    const batchForm = document.getElementById('batchForm');

    batchForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const batchNumber = document.getElementById('batchNumber').value;
      const packageAmount = document.getElementById('packageAmount').value;
      const packageSize = document.getElementById('packageSize').value;
      const description = document.getElementById('description').value;
      const comments = document.getElementById('comments').value;
      const documentUpload = document.getElementById('documentUpload').files[0];
      
      let documentName = '';
      if (documentUpload) {
        documentName = documentUpload.name;
      }

      const batch = {
        batchNumber,
        packageAmount,
        packageSize,
        description,
        comments,
        documentUpload: documentName
      };

      batches.push(batch);
      localStorage.setItem(batchesKey, JSON.stringify(batches));
      populateTable();
      batchForm.reset();
      $('#batchModal').modal('hide');
    });

    function populateTable() {
      tableBody.innerHTML = '';
      batches.forEach((batch, index) => {
        const row = document.createElement('tr');

        const qrCodeUrl = `single_batch.html?chemical=${encodeURIComponent(chemicalName)}&batch=${encodeURIComponent(batch.batchNumber)}`;
        
        row.innerHTML = `
          <td>${batch.batchNumber}</td>
          <td>${batch.packageAmount}</td>
          <td>${batch.packageSize}</td>
          <td>${batch.description}</td>
          <td>${batch.comments}</td>
          <td>${batch.documentUpload}</td>
          <td id="qrcode-${index}"></td>
          <td><button class="btn btn-danger btn-sm" onclick="deleteBatch(${index})">Delete</button></td>
        `;
        
        tableBody.appendChild(row);

        // Generate QR code
        const qrCodeContainer = document.getElementById(`qrcode-${index}`);
        new QRCode(qrCodeContainer, {
          text: qrCodeUrl,
          width: 64,
          height: 64
        });
      });
    }

    window.deleteBatch = function(index) {
      batches.splice(index, 1);
      localStorage.setItem(batchesKey, JSON.stringify(batches));
      populateTable();
    };

    // Initial population of the table
    populateTable();
  });
}

// Summary page functionality (summary.html)
function setupSummaryPage() {
  document.addEventListener('DOMContentLoaded', function() {
    const chemicals = ["Water", "Ethanol", "Sodium chloride", "Acetic acid", "Hydrogen peroxide", "Methane", "Carbon dioxide"];
    const tableBody = document.querySelector('#summaryTable tbody');
    const searchInput = document.getElementById('searchInput');

    function populateSummaryTable(filteredChemicals = null) {
      tableBody.innerHTML = '';
      (filteredChemicals || chemicals).forEach(chemical => {
        const batchesKey = `batches_${chemical}`;
        const batches = JSON.parse(localStorage.getItem(batchesKey)) || [];
        batches.forEach(batch => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${chemical}</td>
            <td>${batch.batchNumber}</td>
            <td>${batch.packageAmount}</td>
            <td>${batch.packageSize}</td>
            <td>${batch.description}</td>
            <td>${batch.comments}</td>
            <td>${batch.documentUpload}</td>
          `;
          tableBody.appendChild(row);
        });
      });
    }

    function filterSummary() {
      const searchTerm = searchInput.value.toLowerCase();
      const filteredChemicals = chemicals.filter(chemical => {
        const batchesKey = `batches_${chemical}`;
        const batches = JSON.parse(localStorage.getItem(batchesKey)) || [];
        return batches.some(batch =>
          chemical.toLowerCase().includes(searchTerm) ||
          batch.batchNumber.toLowerCase().includes(searchTerm)
        );
      });
      populateSummaryTable(filteredChemicals);
    }

    searchInput.addEventListener('input', filterSummary);

    // Initial population of the table
    populateSummaryTable();
  });
}

// Initialize the appropriate page
if (document.querySelector('#chemicalsTable')) {
  populateChemicalsTable();
} else if (document.querySelector('#batchesTable')) {
  setupBatchPage();
} else if (document.querySelector('#summaryTable')) {
  setupSummaryPage();
}
