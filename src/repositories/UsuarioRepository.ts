import { PrismaClient } from '@prisma/client';
import { UsuarioDTO } from '../dto/UsuarioDTO';

const prisma = new PrismaClient();

class UsuarioRepository {
    async criarUsuario(usuario: UsuarioDTO) {
        try {
            // Verificar se o usuário já existe pelo login ou email
            const usuarioExistente = await prisma.usuario.findFirst({ where: { OR: [{ login: usuario.login }, { email: usuario.email }] } });
            if (usuarioExistente) {
                throw new Error("Usuário já existe");
            }

            // Criar o novo usuário
            const novoUsuario = await prisma.usuario.create({ data: usuario });

            return novoUsuario;
        } catch (error) {
            throw new Error(`Erro ao criar usuário: ${error}`);
        }
    }

    async encontrarUsuarioPorLogin(login: string) {
        try {
            // Encontrar o usuário pelo login
            const usuario = await prisma.usuario.findUnique({ where: { login } });

            return usuario;
        } catch (error) {
            throw new Error(`Erro ao encontrar usuário: ${error}`);
        }
    }
}

export default new UsuarioRepository();