import {connect, Client, ResultRow} from 'ts-postgres';
import { config } from 'dotenv';

config();
let conexao: Client;

export async function conectarBanco(): Promise<Client>{
    const connectionOptions = {
        host: process.env.HOST,
        port: Number(process.env.PORT),
        database: process.env.DATABASE,
        user: process.env.USER,
        password: process.env.PASSWORD,
    };

    try {
        conexao = await connect(connectionOptions);
        console.log('Conectado ao Banco de Dados');
    } catch (error) {
        console.error('\nErro na conexão com o Banco:', error);
    }
    return conexao;
}

export async function encerrarConexao(){
    if (conexao) {
        try {
            await conexao.end();
            console.log('\nConexão com o Banco encerrada');
        } catch (error) {
            console.error('\nErro ao encerrar conexão com o Banco:', error);
        }
    }
}

export async function inserirUsuario(nome: string, login: string, email: string, senha: string, local_assoc: string, ){
    if (!conexao) {
        console.error('\nNão existe um Banco de Dados conectado');
        return;
    }

    try {
        const query = `
            INSERT INTO usuario (nome, login, email, senha, local_assoc)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_usuario
        `;
        const result = await conexao.query(query, [nome, login, email, senha, local_assoc]);

        const idU = result.rows[0].get('id_usuario');
        console.log(`\nNovo usuário inserida com ID: ${idU}`);
    } catch (error) {
        console.error('\nErro ao inserir usuário:', error);
    }
}

export async function getUsuario(): Promise<{id_usuario:number; local_assoc:string}[]>{
    if (!conexao) {
        console.error('\nNão existe um Banco de Dados conectado');
        return [];
    }
    try{
        const query = `
            SELECT id_usuario, local_assoc FROM usuario
        `;
        const result = await conexao.query(query);
        let linhas: {id_usuario:number; local_assoc:string}[] = [];
        result.rows.forEach((row: any) => {
            linhas.push({id_usuario:row[0], local_assoc:row[1]});
        });
        return linhas;
    }catch(error){
        console.error(`\nErro ao pegar dados da tabela usuario:`, error);
        throw error;
    }
}