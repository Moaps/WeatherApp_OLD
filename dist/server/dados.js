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

// src/server/dados.ts
var dados_exports = {};
__export(dados_exports, {
  default: () => dados_default
});
module.exports = __toCommonJS(dados_exports);

// src/server/banco.ts
var import_ts_postgres = require("ts-postgres");
var import_dotenv = require("dotenv");
(0, import_dotenv.config)();
var conexao;
function conectarBanco() {
  return __async(this, null, function* () {
    const connectionOptions = {
      host: "164.92.111.91",
      port: 5432,
      database: "weatherapp",
      user: "postgres",
      password: "unitau123"
    };
    try {
      conexao = yield (0, import_ts_postgres.connect)(connectionOptions);
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
      } catch (error) {
        console.error("\nErro ao encerrar conex\xE3o com o Banco:", error);
      }
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

// src/server/dados.ts
var DadosAPI = class {
  constructor() {
    this.key = "3a0d1a4a72d54c0bb3804412242103";
    this.url = "http://api.weatherapi.com/v1";
  }
  localUsuario(idUsuario) {
    return __async(this, null, function* () {
      yield conectarBanco();
      const usuario = yield getUsuario();
      for (var u of usuario) {
        if (u["id_usuario"] === idUsuario) {
          yield encerrarConexao();
          return u["local_assoc"];
        }
      }
      yield encerrarConexao();
      return "Usu\xE1rio n\xE3o encontrado";
    });
  }
  inserirDadosClimaAtual(idUsuario) {
    return __async(this, null, function* () {
      let local = yield this.localUsuario(idUsuario);
      let conexao2 = yield conectarBanco();
      if (local === "Usu\xE1rio n\xE3o encontrado") {
        console.log(local);
      } else {
        const site = this.url + "/current.json?key=" + this.key + "&q=" + local + "&lang=pt";
        try {
          const response = yield fetch(site);
          if (!response.ok) {
            yield encerrarConexao();
            throw new Error("Deu ruim");
          }
          const dados = yield response.json();
          const temperatura = dados["current"]["temp_c"];
          const precipitacao = dados["current"]["precip_mm"];
          let data_log = new Date(dados["location"]["localtime"]);
          data_log.setHours(data_log.getHours() - 3);
          const local_assoc = local;
          const condicao_climatica = dados["current"]["condition"]["text"];
          const vento_max = dados["current"]["wind_kph"];
          const umidade = dados["current"]["humidity"];
          const sensacao_termica = dados["current"]["feelslike_c"];
          const query = `
                    INSERT INTO clima (temperatura, precipitacao, data_log, local_assoc, condicao_climatica, vento_max, umidade, sensacao_termica)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                `;
          yield conexao2.query(query, [temperatura, precipitacao, data_log, local_assoc, condicao_climatica, vento_max, umidade, sensacao_termica]);
          console.log("Dados adicionados com successo.");
        } catch (error) {
          console.error("Erro ao adicionar dados!", error);
          yield encerrarConexao();
          throw error;
        }
      }
      yield encerrarConexao();
    });
  }
  //formato data: "AAAA-MM-DD"
  inserirDadosPrevisao(dia, idUsuario) {
    return __async(this, null, function* () {
      let local = yield this.localUsuario(idUsuario);
      let conexao2 = yield conectarBanco();
      if (local === "Usu\xE1rio n\xE3o encontrado") {
        console.log(local);
      } else {
        const data = new Date(dia);
        const hoje = /* @__PURE__ */ new Date();
        let data2 = new Date(hoje);
        data2.setDate(hoje.getDate() + 14);
        let site;
        if (data < data2) {
          site = this.url + "/forecast.json?key=" + this.key + "&q=" + local + "&days=1&dt=" + dia + "&lang=pt";
        } else {
          console.log(`
Data muito distante, escolha um dia entre "${hoje}" e "${data2}
"`);
          yield encerrarConexao();
          return;
        }
        try {
          const response = yield fetch(site);
          if (!response.ok) {
            yield encerrarConexao();
            throw new Error("Deu ruim");
          }
          let dados = yield response.json();
          dados = dados["forecast"]["forecastday"][0].day;
          const query = `
                    INSERT INTO previsao (temperatura_max, temperatura_min, temperatura_med, condicao_climatica, vento_max, precipitacao_max, probabilidade_chuva, data_log, local_assoc, umidade)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                `;
          yield conexao2.query(query, [dados["maxtemp_c"], dados["mintemp_c"], dados["avgtemp_c"], dados["condition"]["text"], dados["maxwind_kph"], dados["totalprecip_mm"], dados["daily_chance_of_rain"], data, local, dados["avghumidity"]]);
          console.log("Dados adicionados com successo.");
        } catch (error) {
          console.error("Erro ao adicionar dados!", error);
          yield encerrarConexao();
          throw error;
        }
      }
      yield encerrarConexao();
    });
  }
  //formato data: "AAAA-MM-DD"
  inserirDadosPassado(dia, idUsuario) {
    return __async(this, null, function* () {
      let local = yield this.localUsuario(idUsuario);
      let conexao2 = yield conectarBanco();
      if (local === "Usu\xE1rio n\xE3o encontrado") {
        console.log(local);
      } else {
        const site = this.url + "/history.json?key=" + this.key + "&q=" + local + "&dt=" + dia + "&lang=pt";
        try {
          const response = yield fetch(site);
          if (!response.ok) {
            yield encerrarConexao();
            throw new Error("Deu ruim");
          }
          let dados = yield response.json();
          const data = new Date(dia);
          dados = dados["forecast"]["forecastday"][0].day;
          const query = `
                    INSERT INTO passado (temperatura_max, temperatura_min, temperatura_med, condicao_climatica, vento_max, precipitacao_max, probabilidade_chuva, data_log, local_assoc, umidade)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                `;
          yield conexao2.query(query, [dados["maxtemp_c"], dados["mintemp_c"], dados["avgtemp_c"], dados["condition"]["text"], dados["maxwind_kph"], dados["totalprecip_mm"], dados["daily_chance_of_rain"], data, local, dados["avghumidity"]]);
          console.log("Dados adicionados com successo.");
        } catch (error) {
          console.error("Erro ao adicionar dados!", error);
          yield encerrarConexao();
          throw error;
        }
      }
      yield encerrarConexao();
    });
  }
};
var dados_default = new DadosAPI();
