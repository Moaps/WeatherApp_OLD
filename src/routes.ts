import express from 'express';
import UsuarioController from './controllers/UsuarioController';

const router = express.Router();

// Rota para criar um usuário
router.post('/usuarios', UsuarioController.criarUsuario);

// Rota para fazer login
router.post('/login', UsuarioController.login);

export default router;
