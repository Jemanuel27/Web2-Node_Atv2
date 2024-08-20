// app.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import placasRouter from './routes/placas.js';

dotenv.config();

const app = express();

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.json());
app.use('/api/placas', placasRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
