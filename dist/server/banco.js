"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/server/banco.ts
var banco_exports = {};
__export(banco_exports, {
  conectarBanco: () => conectarBanco,
  encerrarConexao: () => encerrarConexao,
  getUsuario: () => getUsuario,
  inserirUsuario: () => inserirUsuario
});
module.exports = __toCommonJS(banco_exports);
var import_ts_postgres = require("ts-postgres");
var import_dotenv = require("dotenv");
(0, import_dotenv.config)();
var conexao;
function conectarBanco() {
  return __async(this, null, function* () {
    const connectionOptions = {
      host: process.env.HOST,
      port: Number(process.env.PORT),
      database: process.env.DATABASE,
      user: process.env.USER,
      password: process.env.PASSWORD
    };
    try {
      conexao = yield (0, import_ts_postgres.connect)(connectionOptions);
      console.log("Conectado ao Banco de Dados");
    } catch (error) {
      console.error("\nErro na conex\xE3o com o Banco:", error);
    }
    return conexao;
  });
}
function encerrarConexao() {
  return __async(this, null, function* () {
    if (conexao) {
      try {
        yield conexao.end();
        console.log("\nConex\xE3o com o Banco encerrada");
      } catch (error) {
        console.error("\nErro ao encerrar conex\xE3o com o Banco:", error);
      }
    }
  });
}
function inserirUsuario(nome, login, email, senha, local_assoc) {
  return __async(this, null, function* () {
    if (!conexao) {
      console.error("\nN\xE3o existe um Banco de Dados conectado");
      return;
    }
    try {
      const query = `
            INSERT INTO usuario (nome, login, email, senha, local_assoc)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_usuario
        `;
      const result = yield conexao.query(query, [nome, login, email, senha, local_assoc]);
      const idU = result.rows[0].get("id_usuario");
      console.log(`
Novo usu\xE1rio inserida com ID: ${idU}`);
    } catch (error) {
      console.error("\nErro ao inserir usu\xE1rio:", error);
    }
  });
}
function getUsuario() {
  return __async(this, null, function* () {
    if (!conexao) {
      console.error("\nN\xE3o existe um Banco de Dados conectado");
      return [];
    }
    try {
      const query = `
            SELECT id_usuario, local_assoc FROM usuario
        `;
      const result = yield conexao.query(query);
      let linhas = [];
      result.rows.forEach((row) => {
        linhas.push({ id_usuario: row[0], local_assoc: row[1] });
      });
      return linhas;
    } catch (error) {
      console.error(`
Erro ao pegar dados da tabela usuario:`, error);
      throw error;
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  conectarBanco,
  encerrarConexao,
  getUsuario,
  inserirUsuario
});
