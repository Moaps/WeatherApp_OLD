interface UsuarioDTO {
    id_usuario?: number; // O ID pode ser opcional, dependendo do contexto de uso
    nome: string;
    login: string;
    email: string;
    senha: string;
    local_assoc?: string | null; // Local assoc. pode ser opcional ou nulo
    avaliacao?: any[]; // Você pode substituir 'any[]' pelo tipo correto de AvaliacaoDTO se aplicável
}

export { UsuarioDTO };