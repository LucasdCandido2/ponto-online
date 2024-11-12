const URL_RECORD = '/api/records';

document.getElementById('registerButton').addEventListener('click', async () => {
  const date = new Date();
  const record = {
    nome: "Lucas Dourado Candido",
    data: date.toLocaleDateString(),
    entrada: date.toLocaleTimeString(),
  };

  try {
    const response = await fetch(URL_RECORD, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    if (!response.ok) throw new Error('Erro ao adicionar o registro');
    loadRecords();
  } catch (error) {
    console.error(error);
  }
});

async function loadRecords() {
  try {
    const response = await fetch(URL_RECORD);
    const records = await response.json();
    renderTable(records);
  } catch (error) {
    console.error("Erro ao carregar os registros:", error);
  }
}

function renderTable(records) {
  const tableBody = document.querySelector('#recordsTable tbody');
  tableBody.innerHTML = '';
  records.forEach(record => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.nome}</td>
      <td>${record.data}</td>
      <td>${record.entrada || ''}</td>
      <td>${record.saidaAlmoco || ''}</td>
      <td>${record.entradaAlmoco || ''}</td>
      <td>${record.saida || ''}</td>
      <td>${record.observacao || ''}</td>
    `;
    tableBody.appendChild(row);
  });
}

loadRecords();
