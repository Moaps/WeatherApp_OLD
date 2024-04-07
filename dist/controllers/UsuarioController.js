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

// src/controllers/UsuarioController.ts
var UsuarioController_exports = {};
__export(UsuarioController_exports, {
  default: () => UsuarioController_default
});
module.exports = __toCommonJS(UsuarioController_exports);

// src/database/primsaClient.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/controllers/UsuarioController.ts
var UsuarioController = class {
  criarUsuario(request, response) {
    return __async(this, null, function* () {
      try {
        const { nome, login, email, senha, local_assoc } = request.body;
        if (!nome || !login || !email || !senha) {
          return response.status(400).json({ message: "Todos os campos s\xE3o obrigat\xF3rios" });
        }
        const usuarioExistente = yield prisma.usuario.findFirst({ where: { OR: [{ login }, { email }] } });
        if (usuarioExistente) {
          return response.status(400).json({ message: "Usu\xE1rio j\xE1 existe" });
        }
        const novoUsuario = yield prisma.usuario.create({ data: { nome, login, email, senha, local_assoc } });
        return response.status(201).json({ message: "Usu\xE1rio criado com sucesso", usuario: novoUsuario });
      } catch (error) {
        return response.status(500).json({ message: "Erro ao criar usu\xE1rio", error });
      }
    });
  }
  login(request, response) {
    return __async(this, null, function* () {
      try {
        const { login, senha } = request.body;
        if (!login || !senha) {
          return response.status(400).json({ message: "Login e senha s\xE3o obrigat\xF3rios" });
        }
        const usuario = yield prisma.usuario.findUnique({ where: { login } });
        if (!usuario) {
          return response.status(404).json({ message: "Usu\xE1rio n\xE3o encontrado" });
        }
        if (usuario.senha !== senha) {
          return response.status(401).json({ message: "Senha incorreta" });
        }
        return response.status(200).json({ message: "Login bem-sucedido", usuario });
      } catch (error) {
        return response.status(500).json({ message: "Erro ao fazer login", error });
      }
    });
  }
};
var UsuarioController_default = new UsuarioController();
