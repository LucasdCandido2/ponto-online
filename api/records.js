const fs = require('fs').promises;
const path = require('path');

module.exports = async (req, res) => {
  const recordsPath = path.join(__dirname, '..', 'data', 'records.json'); // Caminho para o arquivo JSON

  if (req.method === 'GET') {
    try {
      const data = await fs.readFile(recordsPath, 'utf8');
      res.status(200).json(JSON.parse(data));
    } catch (err) {
      res.status(500).json({ message: 'Erro ao ler os registros' });
    }
  } else if (req.method === 'POST') {
    const newRecord = req.body;
    try {
      const data = await fs.readFile(recordsPath, 'utf8');
      const records = JSON.parse(data);
      records.push(newRecord);
      await fs.writeFile(recordsPath, JSON.stringify(records, null, 2));
      res.status(201).json({ message: 'Registro adicionado com sucesso' });
    } catch (err) {
      res.status(500).json({ message: 'Erro ao salvar o registro' });
    }
  } else if (req.method === 'PUT') {
    const recordId = req.url.split('/').pop(); // Captura o último segmento da URL como ID
    const updatedRecord = req.body;
  
    console.log('Atualizando o registro com ID:', recordId);
    console.log('Dados recebidos para atualização:', updatedRecord);
  
    try {
      const data = await fs.readFile(recordsPath, 'utf8');
      const records = JSON.parse(data);
      const index = records.findIndex(record => record.id == recordId);
  
      if (index !== -1) {
        console.log('Registro encontrado, atualizando...');
        records[index] = { ...records[index], ...updatedRecord };
        await fs.writeFile(recordsPath, JSON.stringify(records, null, 2));
        res.status(200).json({ message: 'Registro atualizado com sucesso' });
      } else {
        console.log('Registro não encontrado');
        res.status(404).json({ message: 'Registro não encontrado' });
      }
    } catch (err) {
      console.error('Erro ao atualizar o registro:', err);
      res.status(500).json({ message: 'Erro ao atualizar o registro', error: err.message });
    }
  
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
};
