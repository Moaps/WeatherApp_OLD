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

// src/repositories/AvaliacaoRepository.ts
var AvaliacaoRepository_exports = {};
__export(AvaliacaoRepository_exports, {
  default: () => AvaliacaoRepository_default
});
module.exports = __toCommonJS(AvaliacaoRepository_exports);
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var AvaliacaoRepository = class {
  criarAvaliacao(avaliacao) {
    return __async(this, null, function* () {
      try {
        const novaAvaliacao = yield prisma.avaliacao.create({
          data: {
            id_usuario: avaliacao.id_usuario,
            id_dado_clima: avaliacao.id_dado_clima,
            data: avaliacao.data,
            comentario: avaliacao.comentario,
            estado_clima: avaliacao.estado_clima,
            estado_temperatura: avaliacao.estado_temperatura
          }
        });
        return novaAvaliacao;
      } catch (error) {
        throw new Error(`Erro ao criar avalia\xE7\xE3o: ${error}`);
      }
    });
  }
  // Outros métodos do repositório conforme necessário
};
var AvaliacaoRepository_default = new AvaliacaoRepository();
