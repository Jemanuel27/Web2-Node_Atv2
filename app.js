const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Configuração do middleware
app.use(express.json());

// Importa e usa as rotas
const placaRoutes = require('./routes/PlacaRoutes');
app.use('/', placaRoutes);

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
