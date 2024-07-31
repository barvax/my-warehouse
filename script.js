const chemicals = [
  {
    name: "Water",
    iupacName: "Oxidane",
    casNumber: "7732-18-5",
    meltingPoint: 0,
    boilingPoint: 100,
    molecularWeight: 18.01528
  },
  {
    name: "Ethanol",
    iupacName: "Ethanol",
    casNumber: "64-17-5",
    meltingPoint: -114.1,
    boilingPoint: 78.37,
    molecularWeight: 46.06844
  },
  {
    name: "Sodium chloride",
    iupacName: "Sodium chloride",
    casNumber: "7647-14-5",
    meltingPoint: 801,
    boilingPoint: 1413,
    molecularWeight: 58.44
  },
  {
    name: "Acetic acid",
    iupacName: "Ethanoic acid",
    casNumber: "64-19-7",
    meltingPoint: 16.6,
    boilingPoint: 118.1,
    molecularWeight: 60.052
  },
  {
    name: "Hydrogen peroxide",
    iupacName: "Hydrogen peroxide",
    casNumber: "7722-84-1",
    meltingPoint: -0.43,
    boilingPoint: 150.2,
    molecularWeight: 34.0147
  },
  {
    name: "Methane",
    iupacName: "Methane",
    casNumber: "74-82-8",
    meltingPoint: -182.5,
    boilingPoint: -161.5,
    molecularWeight: 16.04
  },
  {
    name: "Carbon dioxide",
    iupacName: "Carbon dioxide",
    casNumber: "124-38-9",
    meltingPoint: -78.5,
    boilingPoint: -78.5,
    molecularWeight: 44.01
  }
];

const tableBody = document.querySelector('#chemicalsTable tbody');

function populateTable(chemicals) {
  tableBody.innerHTML = ''; // Clear the table body
  chemicals.forEach(chemical => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${chemical.name}</td>
      <td>${chemical.iupacName}</td>
      <td>${chemical.casNumber}</td>
      <td>${chemical.meltingPoint}</td>
      <td>${chemical.boilingPoint}</td>
      <td>${chemical.molecularWeight}</td>
    `;

    row.addEventListener('click', () => {
      const newWindow = window.open('', '_blank');
      newWindow.document.write(`
        <html>
          <head>
            <title>${chemical.name}</title>
          </head>
          <body>
            <h1>${chemical.name}</h1>
          </body>
        </html>
      `);
      newWindow.document.close();
    });

    tableBody.appendChild(row);
  });
}

document.getElementById('searchInput').addEventListener('input', function() {
  const searchTerm = this.value.toLowerCase();
  const filteredChemicals = chemicals.filter(chemical => 
    chemical.name.toLowerCase().includes(searchTerm) || 
    chemical.casNumber.includes(searchTerm)
  );
  populateTable(filteredChemicals);
});

// Initial population of the table
populateTable(chemicals);
