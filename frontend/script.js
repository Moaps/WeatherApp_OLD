const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors()); 

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '', 'app.html'));
});

app.get('/climas', (req, res) => {
    const query = 'SELECT * FROM clima;';
  
    pool.query(query, (error, result) => {
        if (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro ao obter dados do banco.');
      } else {
        const climas = result.rows;
        res.json(climas);
      }
    });
});

app.get('/previsoes', (req, res) => {
    const query = 'SELECT * FROM previsao;';
  
    pool.query(query, (error, result) => {
        if (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro ao obter dados do banco.');
      } else {
        const previsao = result.rows;
        res.json(previsao);
      }
    });
});

app.listen(port, () => {
    console.log(`Servidor acessando a porta ${port}`);
});