"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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

// src/server.ts
var server_exports = {};
__export(server_exports, {
  conectar: () => conectar,
  desconectar: () => desconectar,
  prisma: () => prisma
});
module.exports = __toCommonJS(server_exports);
var import_express = __toESM(require("express"));
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var app = (0, import_express.default)();
var port = 5432;
var router = import_express.default.Router();
function main() {
  return __async(this, null, function* () {
    app.use(import_express.default.json());
    app.use(router);
    app.all("*", (req, res) => {
      res.status(404).json({ error: `Rota ${req.originalUrl} n\xE3o encontrada` });
    });
    app.listen(port, () => {
      console.log(`Conectado ao Banco na porta: ${port}`);
    });
  });
}
function conectar() {
  return __async(this, null, function* () {
    main().then(() => __async(this, null, function* () {
      yield prisma.$connect();
    })).catch((e) => __async(this, null, function* () {
      console.error(e);
      yield prisma.$disconnect();
      process.exit(1);
    }));
  });
}
function desconectar() {
  return __async(this, null, function* () {
    console.log(`Desconectado do Banco na porta: ${port}`);
    yield prisma.$disconnect();
    process.exit(1);
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  conectar,
  desconectar,
  prisma
});
