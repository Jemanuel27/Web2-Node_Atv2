// models/placa.js
import mongoose from 'mongoose';

const placaSchema = new mongoose.Schema({
  numero: String,
  cidade: String,
  dataHora: { type: Date, default: Date.now }
});

export default mongoose.model('Placa', placaSchema);
