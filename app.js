const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.get('/imagemOcr', async (req, res) => {
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
