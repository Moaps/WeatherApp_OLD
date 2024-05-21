import { PrismaClient } from '@prisma/client';
import { AvaliacaoDTO } from '../dto/AvaliacaoDTO';

const prisma = new PrismaClient();

class AvaliacaoRepository {
    async criarAvaliacao(avaliacao: AvaliacaoDTO) {
        try {
            const novaAvaliacao = await prisma.avaliacao.create({
                data: {
                    id_usuario: avaliacao.id_usuario,
                    id_dado_clima: avaliacao.id_dado_clima,
                    data: avaliacao.data,
                    comentario: avaliacao.comentario,
                    estado_clima: avaliacao.estado_clima,
                    estado_temperatura: avaliacao.estado_temperatura,
                },
            });

            return novaAvaliacao;
        } catch (error) {
            throw new Error(`Erro ao criar avaliação: ${error}`);
        }
    }

    // Outros métodos do repositório conforme necessário
}

export default new AvaliacaoRepository();
