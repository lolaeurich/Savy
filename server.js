import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Servir arquivos estáticos da pasta build
app.use(express.static(path.join(__dirname, 'build')));

// Redirecionar todas as rotas para o index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Definir porta (use a recomendada pelo Plesk)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor estático rodando na porta ${PORT}`);
});