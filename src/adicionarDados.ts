import UsuarioController from "./controllers/UsuarioController"
import * as express from 'express';

const Request = {
    body: {
        nome: "Anderson",
        login: "ander",
        email: "anderson_m_a_@hotmail.com",
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

UsuarioController.criarUsuario(Request, Response);
