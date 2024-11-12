import express from 'express';
import cors from 'cors';
import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.get('/api/records', async (req, res) => {
  const recordsRef = collection(db, 'registros');
  try {
    const snapshot = await getDocs(recordsRef);
    const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao carregar registros', error });
  }
});

app.post('/api/records', async (req, res) => {
  const recordsRef = collection(db, 'registros');
  try {
    const docRef = await addDoc(recordsRef, req.body);
    res.status(201).json({ message: 'Registro adicionado com sucesso', id: docRef.id });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar registro', error });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
