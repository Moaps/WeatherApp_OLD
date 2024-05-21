export interface AvaliacaoDTO {
    id_usuario: number;
    id_dado_clima: number;
    data?: Date;
    comentario?: string;
    estado_clima?: string;
    estado_temperatura?: string;
}
