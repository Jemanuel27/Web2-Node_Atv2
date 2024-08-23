//PlacaRoutes
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const PDFDocument = require('pdfkit');
const Placa = require('../models/placa')
const router = express.Router();
 const upload = require('../config/multer')

// Rota POST para '/cadastroPlaca'
router.post('/cadastroPlaca', upload.single('foto'), async (req, res) => {
    const { cidade } = req.body;
    const imageUrl = req.file.path; // Obtém o caminho do arquivo carregado

    if (!imageUrl) {
        return res.status(400).json({ message: 'Imagem não fornecida' });
    }

    try {
        // Chama a API OCR para extrair o texto da imagem
        const response = await axios.post('https://document-ocr1.p.rapidapi.com/idr', {
            url: imageUrl
        }, {
            headers: {
                'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'document-ocr1.p.rapidapi.com'
            }
        });

        const numeroPlaca = response.data.text.trim(); // Texto extraído da imagem

        // Salva no banco de dados
        const novaPlaca = new Placa({
            numeroPlaca,
            cidade
        });

        await novaPlaca.save();

        res.status(201).json({ message: 'Placa cadastrada com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao cadastrar placa' });
    }
});

// Rota GET para '/relatorio/cidade/:cidade'
router.get('/relatorio/cidade/:cidade', async (req, res) => {
    const { cidade } = req.params;

    try {
        const placas = await Placa.find({ cidade });
        const doc = new PDFDocument();

        res.setHeader('Content-disposition', 'attachment; filename=relatorio.pdf');
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        doc.fontSize(25).text('Relatório de Placas', { align: 'center' });
        doc.fontSize(15);

        placas.forEach(placa => {
            doc.text(`Número da Placa: ${placa.numeroPlaca}`);
            doc.text(`Cidade: ${placa.cidade}`);
            doc.text(`Data e Hora: ${placa.dataHora}`);
            doc.text('----------------------');
        });

        doc.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao gerar relatório' });
    }
});

// Rota GET para '/consulta/:placa'
router.get('/consulta/:placa', async (req, res) => {
    const { placa } = req.params;

    try {
        const resultado = await Placa.findOne({ numeroPlaca: placa });

        if (resultado) {
            res.status(200).json({ message: 'Placa encontrada', placa: resultado });
        } else {
            res.status(404).json({ message: 'Placa não encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao consultar placa' });
    }
});

module.exports = router;





































// Rota POST para '/cadastroPlaca'
/*router.post('/cadastroPlaca', async (req, res) => {
    const cidade = req.body.cidade; // Obtendo 'cidade' do corpo da requisição
    
    // Link da imagem fixo para teste
    const imageURL = 'https://www.sinalplast.com.br/wp-content/uploads/2016/05/SPF11.jpg';
    
    if (!cidade) { // Verificando se 'cidade' foi fornecida
        return res.status(400).json({ message: 'Cidade não fornecida.' });
    }
    
    try {
        // Chama a API OCR para extrair o texto da imagem
        const response = await axios.post('https://ocr-extract-text.p.rapidapi.com/ocr', {
            url: imageUrl
        }, {
            headers: {
                'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'ocr-extract-text.p.rapidapi.com'
            }
        });
    
        const numeroPlaca = response.data.text.trim(); // texto extraído da imagem

    // Salva no banco de dados 
    const novaPlaca = new Placa({
        numeroPlaca,
        cidade
    })

    await novaPlaca.save()

    res.status(201).json({message: 'Placa cadastrada com Sucesso!'})
}catch (erro){
    console.error(error)
    res.status(500).json({message: 'Erro ao cadastrar Placa'})
} 
})

module.exports = router; */


/*app.get('/imagemOcr', async (req, res) => {
    // URL da imagem que você quer processar
    const imageUrl = 'https://www.sinalplast.com.br/wp-content/uploads/2016/05/SPF11.jpg';

    // Configuração da requisição para a API
    const options = {
        method: 'GET',
        url: `https://ocr-extract-text.p.rapidapi.com/ocr`,
        params: { url: imageUrl }, // Parâmetro da imagem
        headers: {
            'X-RapidAPI-Key': process.env.X_RapidAPI_Key, // Certifique-se de que a chave está correta no .env
            'X-RapidAPI-Host': 'ocr-extract-text.p.rapidapi.com'
        }
    };

    try {
        // Fazendo a requisição para a API
        const response = await axios.request(options);
        console.log(response.data.text);
        res.json({ texto: response.data.text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao processar a imagem' });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
*/


