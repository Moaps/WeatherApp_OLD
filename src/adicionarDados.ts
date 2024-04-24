import UsuarioController from "./controllers/UsuarioController"
import DadosAPI from "./server/dados";
import * as express from 'express';

const Request = {
    body: {
        nome: "Nome",
        login: "login",
        email: "nome@email.com",
        senha: "1234",
        local_assoc: "Taubaté"
    }
} as express.Request;

const Response = {
    status: (statusCode: number) => {
      return {
        json: (data: any) => {
          console.log(`Sending JSON response with status code ${statusCode} and data:`, data);
        },
      };
    },
  } as unknown as express.Response

//UsuarioController.criarUsuario(Request, Response);
//DadosAPI.inserirDadosClimaAtual(4);
//DadosAPI.inserirDadosPrevisao('2024-04-28', 4);
