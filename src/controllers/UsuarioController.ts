import { Request, Response } from "express";
import { prisma } from "../database/primsaClient";

class UsuarioController {
    async criarUsuario(req: Request, res: Response){
        await conectar();
        try{
            const{nome, login, email, senha, local_assoc} = req.body;

            //Validação dos Dados
            if(!nome || !login || !email || !senha){
                return res.status(400).json({message: "Todos os campos são obrigatórios!"});
            }

            // Verificar se o usuário já existe pelo login ou email
            const usuarioExistente = await prisma.usuario.findFirst({ where: { OR: [{ login }, { email }] } });
            if (usuarioExistente) {
                return res.status(400).json({ message: "Usuário já existe!" });
            }

            // Criar o novo usuário
            const novoUsuario = await prisma.usuario.create({
                data:{
                    nome,
                    login,
                    email,
                    senha,
                    local_assoc
                }
            });
            await desconectar();
            return res.status(201).json({ message: "Usuário criado com sucesso", usuario: novoUsuario });
        } catch(error){
            await desconectar();
            return res.status(500).json({ message: "Erro ao criar usuário", error: error });
        }
    };

    async login(request: Request, response:Response){
        try {
            const { login, senha } = request.body;

            if (!login || !senha) {
                return response.status(400).json({ message: "Login e senha são obrigatórios" });
            }

            // Verificar se o usuário existe pelo login
            const usuario = await prisma.usuario.findUnique({ where: { login } });
            if (!usuario) {
                return response.status(404).json({ message: "Usuário não encontrado" });
            }

            // Verificar se a senha está correta
            if (usuario.senha !== senha) {
                return response.status(401).json({ message: "Senha incorreta" });
            }

            // Autenticação bem-sucedida
            return response.status(200).json({ message: "Login bem-sucedido", usuario });
        } catch (error) {
            return response.status(500).json({ message: "Erro ao fazer login", error: error});
        }
    }
    
}

export default new UsuarioController
