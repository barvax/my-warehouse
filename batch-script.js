document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const chemicalName = urlParams.get('chemical');
  document.getElementById('chemicalName').textContent = chemicalName;

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
        text: `batch_detail.html?chemical=${encodeURIComponent(chemicalName)}&batch=${encodeURIComponent(batch.batchNumber)}`,
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
