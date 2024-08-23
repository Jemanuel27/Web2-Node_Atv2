const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const PlacasRoutes = require('./routes/PlacaRoutes');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Para servir arquivos estáticos da pasta uploads


// Conectando ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB', err));

// Configurando rotas
app.use('/api', PlacasRoutes); // Prefixo '/api' para rotas

app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
});
