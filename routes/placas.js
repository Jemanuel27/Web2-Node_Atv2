// routes/placas.js
import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import Placa from '../models/placa.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Rota POST para '/cadastroPlaca'
router.post('/cadastroPlaca', upload.single('foto'), async (req, res) => {
  const cidade = req.body.cidade;
  const imagem = req.file ? req.file.buffer : null;
  const imagemUrl = req.body.imagemUrl;
  const ocrApiKey = process.env.OCR_API_KEY;

  const form = new FormData();
  form.append('apikey', ocrApiKey);
  form.append('language', 'eng');

  if (imagem) {
    form.append('file', imagem);
  } else if (imagemUrl) {
    form.append('url', imagemUrl);
  } else {
    return res.status(400).json({ error: 'Imagem ou URL da imagem é necessária' });
  }

  try {
    const response = await axios.post('https://api.ocr.space/parse/image', form, {
      headers: {
        ...form.getHeaders()
      }
    });

    if (response.data.IsErroredOnProcessing) {
      return res.status(500).json({ error: 'Erro ao processar imagem', details: response.data.ErrorMessage });
    }

    const numeroPlaca = response.data.ParsedResults[0].ParsedText.trim();

    const novaPlaca = new Placa({
      numero: numeroPlaca,
      cidade: cidade,
    });

    await novaPlaca.save();
    res.status(201).json({ message: 'Placa cadastrada com sucesso!' });

  } catch (err) {
    res.status(500).json({ error: 'Erro ao comunicar com a API OCR', details: err.message });
  }
});

// Rota GET para '/relatorio/cidade/:cidade'
router.get('/relatorio/cidade/:cidade', async (req, res) => {
  const cidade = req.params.cidade;

  try {
    const registros = await Placa.find({ cidade });

    const doc = new PDFDocument();
    const fileName = `relatorio_${cidade}.pdf`;
    const filePath = `./uploads/${fileName}`;

    doc.pipe(fs.createWriteStream(filePath));

    doc.text(`Relatório de registros para a cidade: ${cidade}`);
    doc.moveDown();

    registros.forEach(registro => {
      doc.text(`Placa: ${registro.numero}`);
      doc.text(`Cidade: ${registro.cidade}`);
      doc.text(`Data e Hora: ${registro.dataHora}`);
      doc.moveDown();
    });

    doc.end();

    doc.on('finish', () => {
      res.download(filePath, fileName, (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
        }
        fs.unlinkSync(filePath);
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota GET para '/consulta/:placa'
router.get('/consulta/:placa', async (req, res) => {
  const placa = req.params.placa;

  try {
    const registro = await Placa.findOne({ numero: placa });

    if (registro) {
      res.status(200).json({ message: 'Placa encontrada no banco de dados.', registro });
    } else {
      res.status(404).json({ message: 'Placa não encontrada no banco de dados.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
