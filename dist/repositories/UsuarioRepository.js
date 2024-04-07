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

// src/repositories/UsuarioRepository.ts
var UsuarioRepository_exports = {};
__export(UsuarioRepository_exports, {
  default: () => UsuarioRepository_default
});
module.exports = __toCommonJS(UsuarioRepository_exports);
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var UsuarioRepository = class {
  criarUsuario(usuario) {
    return __async(this, null, function* () {
      try {
        const usuarioExistente = yield prisma.usuario.findFirst({ where: { OR: [{ login: usuario.login }, { email: usuario.email }] } });
        if (usuarioExistente) {
          throw new Error("Usu\xE1rio j\xE1 existe");
        }
        const novoUsuario = yield prisma.usuario.create({ data: usuario });
        return novoUsuario;
      } catch (error) {
        throw new Error(`Erro ao criar usu\xE1rio: ${error}`);
      }
    });
  }
  encontrarUsuarioPorLogin(login) {
    return __async(this, null, function* () {
      try {
        const usuario = yield prisma.usuario.findUnique({ where: { login } });
        return usuario;
      } catch (error) {
        throw new Error(`Erro ao encontrar usu\xE1rio: ${error}`);
      }
    });
  }
};
var UsuarioRepository_default = new UsuarioRepository();
