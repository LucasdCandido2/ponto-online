const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Configurações iniciais
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Servir arquivos estáticos

// Caminho para o arquivo JSON que armazena os registros
const DATA_FILE = './data.json';

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
    const validData = data.filter(item => item && item.nome);
    fs.writeFileSync(DATA_FILE, JSON.stringify(validData, null, 2));
};

// Rota para obter todos os registros de ponto
app.get('/api/records', (req, res) => {
    const records = loadData();
    res.json(records);
});

// Rota para adicionar um novo registro de ponto (POST)
app.post('/api/records', (req, res) => {
    const records = loadData();
    const newRecord = req.body;

    // Verifica se o registro tem um nome válido
    if (newRecord && newRecord.nome) {
        records.push(newRecord);
        saveData(records);
        res.status(201).json({ message: 'Registro adicionado com sucesso!' });
    } else {
        res.status(400).json({ message: 'Registro inválido' });
    }
});

// Rota para atualizar um registro existente (PUT)
app.put('/api/records/:id', (req, res) => {
    const records = loadData();
    const { id } = req.params;
    const updatedRecord = req.body;

    // Localiza o índice do registro a ser atualizado
    const index = records.findIndex(record => record.id === parseInt(id));

    if (index !== -1) {
        records[index] = { ...records[index], ...updatedRecord };
        saveData(records);
        res.json({ message: 'Registro atualizado com sucesso!' });
    } else {
        res.status(404).json({ message: 'Registro não encontrado' });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
