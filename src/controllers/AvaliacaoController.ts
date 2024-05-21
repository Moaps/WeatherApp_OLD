import { Request, Response } from 'express';
import AvaliacaoRepository from '../repositories/AvaliacaoRepository';
import { AvaliacaoDTO } from '../dto/AvaliacaoDTO';

class AvaliacaoController {
    async criarAvaliacao(req: Request, res: Response) {
        try {
            // Dados da nova avaliação a serem recebidos da requisição
            const { id_usuario, id_dado_clima, data, comentario, estado_clima, estado_temperatura } = req.body;

            // Criar um novo objeto AvaliacaoDTO com os dados recebidos
            const novaAvaliacao: AvaliacaoDTO = {
                id_usuario,
                id_dado_clima,
                data,
                comentario,
                estado_clima,
                estado_temperatura,
            };

            // Adicionar a nova avaliação utilizando o AvaliacaoRepository
            const avaliacaoCriada = await AvaliacaoRepository.criarAvaliacao(novaAvaliacao);

            res.status(201).json(avaliacaoCriada);
        } catch (error) {
            res.status(500).json({error});
        }
    }

    // Outros métodos do controlador conforme necessário
}

export default new AvaliacaoController();
