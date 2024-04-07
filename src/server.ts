import express from 'express';
import routes from './routes';

const app = express();

app.use(express.json());

// Rotas da aplicação
app.use(routes);

// Configuração do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
