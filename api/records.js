const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/records.json');

// Função para carregar dados do arquivo JSON
const loadData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        return [];
    }
};

// Função para salvar dados no arquivo JSON
const saveData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Função para gerar novo ID (simples, só para demonstrar)
const generateId = (records) => {
    const maxId = records.length ? Math.max(...records.map(record => record.id)) : 0;
    return maxId + 1;
};

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'GET') {
        // Rota para obter todos os registros de ponto
        const records = loadData();
        res.status(200).json(records);
    } else if (req.method === 'POST') {
        // Rota para adicionar um novo registro de ponto
        const newRecord = req.body;
        if (newRecord && newRecord.nome) {
            const records = loadData();
            newRecord.id = generateId(records);
            records.push(newRecord);
            saveData(records);
            res.status(201).json({ message: 'Registro adicionado com sucesso!' });
        } else {
            res.status(400).json({ message: 'Registro inválido' });
        }
    } else if (req.method === 'PUT') {
        // Rota para atualizar um registro existente
        const { id } = req.query;
        const updatedRecord = req.body;
        const records = loadData();

        const index = records.findIndex(record => record.id === parseInt(id));
        if (index !== -1) {
            records[index] = { ...records[index], ...updatedRecord };
            saveData(records);
            res.status(200).json({ message: 'Registro atualizado com sucesso!' });
        } else {
            res.status(404).json({ message: 'Registro não encontrado' });
        }
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
};
