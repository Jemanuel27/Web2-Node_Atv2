// config/multerConfig.js

const multer = require('multer');

// Configuração de armazenamento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Define o diretório onde os arquivos serão salvos
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Extrai o nome e a extensão do arquivo original
        const extensaoArquivo = file.originalname.split('.').pop(); // Obtém a extensão do arquivo
        const novoNomeArquivo = file.originalname.split('.').slice(0, -1).join('.'); // Obtém o nome do arquivo sem a extensão
        // Define o novo nome do arquivo
        cb(null, `${novoNomeArquivo}-${Date.now()}.${extensaoArquivo}`);
    }
});

// Instanciando o multer com a configuração de armazenamento
const upload = multer({ storage });

module.exports = upload;
