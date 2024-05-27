"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var banco_1 = require("./banco");
var DadosAPI = /** @class */ (function () {
    function DadosAPI() {
        this.key = "3a0d1a4a72d54c0bb3804412242103";
        this.url = "http://api.weatherapi.com/v1";
    }
    DadosAPI.prototype.localUsuario = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, local;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("https://ipapi.co/city/")];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.text()];
                    case 2:
                        local = _a.sent();
                        return [2 /*return*/, local];
                }
            });
        });
    };
    DadosAPI.prototype.inserirDadosClimaAtual = function () {
        return __awaiter(this, void 0, void 0, function () {
            var local, conexao, site, response, dados, temperatura, precipitacao, data_log, local_assoc, condicao_climatica, vento_max, query, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.localUsuario()];
                    case 1:
                        local = _a.sent();
                        return [4 /*yield*/, (0, banco_1.conectarBanco)()];
                    case 2:
                        conexao = _a.sent();
                        site = this.url + "/current.json?key=" + this.key + '&q=' + local + '&lang=pt';
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 9, , 10]);
                        return [4 /*yield*/, fetch(site)];
                    case 4:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 6];
                        return [4 /*yield*/, (0, banco_1.encerrarConexao)()];
                    case 5:
                        _a.sent();
                        throw new Error('Deu ruim');
                    case 6: return [4 /*yield*/, response.json()];
                    case 7:
                        dados = _a.sent();
                        temperatura = dados['current']['temp_c'];
                        precipitacao = dados['current']['precip_mm'];
                        data_log = new Date(dados['location']['localtime']);
                        data_log.setHours(data_log.getHours() - 3);
                        local_assoc = local;
                        condicao_climatica = dados['current']['condition']['text'];
                        vento_max = dados['current']['wind_kph'];
                        query = "\n                INSERT INTO clima (temperatura, precipitacao, data_log, local_assoc, condicao_climatica, vento_max)\n                VALUES ($1, $2, $3, $4, $5, $6)\n            ";
                        return [4 /*yield*/, conexao.query(query, [temperatura, precipitacao, data_log, local_assoc, condicao_climatica, vento_max])];
                    case 8:
                        _a.sent();
                        console.log("Dados adicionados com successo.");
                        return [3 /*break*/, 10];
                    case 9:
                        error_1 = _a.sent();
                        console.error('Erro ao adicionar dados!', error_1);
                        throw error_1;
                    case 10: return [4 /*yield*/, (0, banco_1.encerrarConexao)()];
                    case 11:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DadosAPI.prototype.inserirExibirDadosClimaAtual = function () {
        return __awaiter(this, void 0, void 0, function () {
            var local, conexao, site, response, dados, dia, temperatura, precipitacao, data_log, local_assoc, condicao_climatica, vento_max, query, dataHora, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.localUsuario()];
                    case 1:
                        local = _a.sent();
                        return [4 /*yield*/, (0, banco_1.conectarBanco)()];
                    case 2:
                        conexao = _a.sent();
                        site = this.url + "/current.json?key=" + this.key + '&q=' + local + '&lang=pt';
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 9, , 10]);
                        return [4 /*yield*/, fetch(site)];
                    case 4:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 6];
                        return [4 /*yield*/, (0, banco_1.encerrarConexao)()];
                    case 5:
                        _a.sent();
                        throw new Error('Deu ruim');
                    case 6: return [4 /*yield*/, response.json()];
                    case 7:
                        dados = _a.sent();
                        dia = dados['location']['localtime'];
                        temperatura = dados['current']['temp_c'];
                        precipitacao = dados['current']['precip_mm'];
                        data_log = new Date(dia);
                        local_assoc = local;
                        condicao_climatica = dados['current']['condition']['text'];
                        vento_max = dados['current']['wind_kph'];
                        query = "\n                INSERT INTO clima (temperatura, precipitacao, data_log, local_assoc, condicao_climatica, vento_max)\n                VALUES ($1, $2, $3, $4, $5, $6)\n            ";
                        return [4 /*yield*/, conexao.query(query, [temperatura, precipitacao, data_log, local_assoc, condicao_climatica, vento_max])];
                    case 8:
                        _a.sent();
                        dataHora = dia.slice(8, 10) + '/' + dia.slice(5, 7) + '/' + dia.slice(0, 4) + ' às ' + dia.slice(11, 16);
                        console.log("\nClima de \"".concat(local, "\" no dia \"").concat(dataHora, "\":\n\nCondi\u00E7\u00E3o Clim\u00E1tica: \"").concat(condicao_climatica, "\"\nTemperatura: \"").concat(temperatura, "\"\u00BA\nPrecipita\u00E7\u00E3o: \"").concat(precipitacao, "\"mm\nVento: \"").concat(vento_max, "\"kmh\n"));
                        return [3 /*break*/, 10];
                    case 9:
                        error_2 = _a.sent();
                        console.error('Erro ao carregar dados!', error_2);
                        throw error_2;
                    case 10: return [4 /*yield*/, (0, banco_1.encerrarConexao)()];
                    case 11:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DadosAPI.prototype.inserirRetornarDadosClimaAtual = function () {
        return __awaiter(this, void 0, void 0, function () {
            var local, conexao, site, response, dados, dia, temperatura, precipitacao, data_log, local_assoc, condicao_climatica, vento_max, dataHora, str, query, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.localUsuario()];
                    case 1:
                        local = _a.sent();
                        return [4 /*yield*/, (0, banco_1.conectarBanco)()];
                    case 2:
                        conexao = _a.sent();
                        site = this.url + "/current.json?key=" + this.key + '&q=' + local + '&lang=pt';
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 10, , 12]);
                        return [4 /*yield*/, fetch(site)];
                    case 4:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 6];
                        return [4 /*yield*/, (0, banco_1.encerrarConexao)()];
                    case 5:
                        _a.sent();
                        throw new Error('Deu ruim');
                    case 6: return [4 /*yield*/, response.json()];
                    case 7:
                        dados = _a.sent();
                        dia = dados['location']['localtime'];
                        temperatura = dados['current']['temp_c'];
                        precipitacao = dados['current']['precip_mm'];
                        data_log = new Date(dia);
                        local_assoc = local;
                        condicao_climatica = dados['current']['condition']['text'];
                        vento_max = dados['current']['wind_kph'];
                        dataHora = dia.slice(8, 10) + '/' + dia.slice(5, 7) + '/' + dia.slice(0, 4) + ' às ' + dia.slice(11, 16);
                        str = "\nClima de \"".concat(local, "\" no dia \"").concat(dataHora, "\":\n\nCondi\u00E7\u00E3o Clim\u00E1tica: \"").concat(condicao_climatica, "\"\nTemperatura: \"").concat(temperatura, "\"\u00BA\nPrecipita\u00E7\u00E3o: \"").concat(precipitacao, "\"mm\nVento: \"").concat(vento_max, "\"kmh\n");
                        query = "\n                INSERT INTO clima (temperatura, precipitacao, data_log, local_assoc, condicao_climatica, vento_max)\n                VALUES ($1, $2, $3, $4, $5, $6)\n            ";
                        return [4 /*yield*/, conexao.query(query, [temperatura, precipitacao, data_log, local_assoc, condicao_climatica, vento_max])];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, (0, banco_1.encerrarConexao)()];
                    case 9:
                        _a.sent();
                        return [2 /*return*/, str];
                    case 10:
                        error_3 = _a.sent();
                        console.error('Erro ao carregar dados!', error_3);
                        return [4 /*yield*/, (0, banco_1.encerrarConexao)()];
                    case 11:
                        _a.sent();
                        throw error_3;
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    //formato data: "AAAA-MM-DD"
    DadosAPI.prototype.inserirDadosPrevisao = function (dia) {
        return __awaiter(this, void 0, void 0, function () {
            var local, conexao, data, hoje, data2, site, response, dados, data_col, query, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.localUsuario()];
                    case 1:
                        local = _a.sent();
                        return [4 /*yield*/, (0, banco_1.conectarBanco)()];
                    case 2:
                        conexao = _a.sent();
                        data = new Date(dia);
                        hoje = new Date();
                        data2 = new Date(hoje);
                        data2.setDate(hoje.getDate() + 14);
                        if (!(data < data2)) return [3 /*break*/, 3];
                        site = this.url + "/forecast.json?key=" + this.key + '&q=' + local + '&days=1&dt=' + dia + '&lang=pt';
                        return [3 /*break*/, 5];
                    case 3:
                        console.log("\nData muito distante, escolha um dia entre \"".concat(hoje, "\" e \"").concat(data2, "\n\""));
                        return [4 /*yield*/, (0, banco_1.encerrarConexao)()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                    case 5:
                        _a.trys.push([5, 11, , 12]);
                        return [4 /*yield*/, fetch(site)];
                    case 6:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 8];
                        return [4 /*yield*/, (0, banco_1.encerrarConexao)()];
                    case 7:
                        _a.sent();
                        throw new Error('Deu ruim');
                    case 8: return [4 /*yield*/, response.json()];
                    case 9:
                        dados = _a.sent();
                        dados = dados['forecast']['forecastday'][0].day;
                        data_col = new Date(dados['location']['localtime']);
                        data_col.setHours(data_col.getHours() - 3);
                        query = "\n                INSERT INTO previsao (temperatura_max, temperatura_min, temperatura_med, condicao_climatica, vento_max, precipitacao_max, data_log, local_assoc, data_col)\n                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)\n            ";
                        return [4 /*yield*/, conexao.query(query, [dados['maxtemp_c'], dados['mintemp_c'], dados['avgtemp_c'], dados['condition']['text'], dados['maxwind_kph'], dados['totalprecip_mm'], data, local, data_col])];
                    case 10:
                        _a.sent();
                        console.log("Dados adicionados com successo.");
                        return [3 /*break*/, 12];
                    case 11:
                        error_4 = _a.sent();
                        console.error('Erro ao adicionar dados!', error_4);
                        throw error_4;
                    case 12: return [4 /*yield*/, (0, banco_1.encerrarConexao)()];
                    case 13:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    //formato data: "AAAA-MM-DD"
    DadosAPI.prototype.inserirExibirDadosPrevisao = function (dia) {
        return __awaiter(this, void 0, void 0, function () {
            var local, conexao, data, hoje, data2, site, response, dados, data_col, query, data3, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.localUsuario()];
                    case 1:
                        local = _a.sent();
                        return [4 /*yield*/, (0, banco_1.conectarBanco)()];
                    case 2:
                        conexao = _a.sent();
                        data = new Date(dia);
                        hoje = new Date();
                        data2 = new Date(hoje);
                        data2.setDate(hoje.getDate() + 14);
                        if (!(data < data2)) return [3 /*break*/, 3];
                        site = this.url + "/forecast.json?key=" + this.key + '&q=' + local + '&days=1&dt=' + dia + '&lang=pt';
                        return [3 /*break*/, 5];
                    case 3:
                        console.log("\nData muito distante, escolha um dia entre \"".concat(hoje, "\" e \"").concat(data2, "\n\""));
                        return [4 /*yield*/, (0, banco_1.encerrarConexao)()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                    case 5:
                        _a.trys.push([5, 11, , 12]);
                        return [4 /*yield*/, fetch(site)];
                    case 6:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 8];
                        return [4 /*yield*/, (0, banco_1.encerrarConexao)()];
                    case 7:
                        _a.sent();
                        throw new Error('Deu ruim');
                    case 8: return [4 /*yield*/, response.json()];
                    case 9:
                        dados = _a.sent();
                        data_col = new Date(dados['location']['localtime']);
                        dados = dados['forecast']['forecastday'][0].day;
                        data_col.setHours(data_col.getHours() - 3);
                        query = "\n                INSERT INTO previsao (temperatura_max, temperatura_min, temperatura_med, condicao_climatica, vento_max, precipitacao_max, data_log, local_assoc, data_col)\n                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)\n            ";
                        return [4 /*yield*/, conexao.query(query, [dados['maxtemp_c'], dados['mintemp_c'], dados['avgtemp_c'], dados['condition']['text'], dados['maxwind_kph'], dados['totalprecip_mm'], data, local, data_col])];
                    case 10:
                        _a.sent();
                        data3 = dia.slice(8, 10) + '/' + dia.slice(5, 7) + '/' + dia.slice(0, 4);
                        console.log("\nClima de \"".concat(local, "\" no dia \"").concat(data3, "\":\n\nCondi\u00E7\u00E3o Clim\u00E1tica: \"").concat(dados['condition']['text'], "\"\nTemperatura M\u00E1xima: \"").concat(dados['maxtemp_c'], "\"\u00BA\nTemperatura M\u00EDnima: \"").concat(dados['mintemp_c'], "\"\u00BA\nTemperatura M\u00E9dia: \"").concat(dados['avgtemp_c'], "\"\u00BA\nPrecipita\u00E7\u00E3o: \"").concat(dados['totalprecip_mm'], "\"mm\nVento: \"").concat(dados['maxwind_kph'], "\"kmh\n"));
                        return [3 /*break*/, 12];
                    case 11:
                        error_5 = _a.sent();
                        console.error('Erro ao adicionar dados!', error_5);
                        throw error_5;
                    case 12: return [4 /*yield*/, (0, banco_1.encerrarConexao)()];
                    case 13:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    //formato data: "AAAA-MM-DD"
    DadosAPI.prototype.inserirRetornarDadosPrevisao = function (dia) {
        return __awaiter(this, void 0, void 0, function () {
            var local, conexao, data, hoje, data2, site, response, dados, data_col, data3, str, query, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.localUsuario()];
                    case 1:
                        local = _a.sent();
                        return [4 /*yield*/, (0, banco_1.conectarBanco)()];
                    case 2:
                        conexao = _a.sent();
                        data = new Date(dia);
                        hoje = new Date();
                        data2 = new Date(hoje);
                        data2.setDate(hoje.getDate() + 14);
                        if (!(data < data2)) return [3 /*break*/, 3];
                        site = this.url + "/forecast.json?key=" + this.key + '&q=' + local + '&days=1&dt=' + dia + '&lang=pt';
                        return [3 /*break*/, 5];
                    case 3:
                        console.log("\nData muito distante, escolha um dia entre \"".concat(hoje, "\" e \"").concat(data2, "\n\""));
                        return [4 /*yield*/, (0, banco_1.encerrarConexao)()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                    case 5:
                        _a.trys.push([5, 12, , 14]);
                        return [4 /*yield*/, fetch(site)];
                    case 6:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 8];
                        return [4 /*yield*/, (0, banco_1.encerrarConexao)()];
                    case 7:
                        _a.sent();
                        throw new Error('Deu ruim');
                    case 8: return [4 /*yield*/, response.json()];
                    case 9:
                        dados = _a.sent();
                        data_col = new Date(dados['location']['localtime']);
                        dados = dados['forecast']['forecastday'][0].day;
                        data_col.setHours(data_col.getHours() - 3);
                        data3 = dia.slice(8, 10) + '/' + dia.slice(5, 7) + '/' + dia.slice(0, 4);
                        str = "\nClima de \"".concat(local, "\" no dia \"").concat(data3, "\":\n\nCondi\u00E7\u00E3o Clim\u00E1tica: \"").concat(dados['condition']['text'], "\"\nTemperatura M\u00E1xima: \"").concat(dados['maxtemp_c'], "\"\u00BA\nTemperatura M\u00EDnima: \"").concat(dados['mintemp_c'], "\"\u00BA\nTemperatura M\u00E9dia: \"").concat(dados['avgtemp_c'], "\"\u00BA\nPrecipita\u00E7\u00E3o: \"").concat(dados['totalprecip_mm'], "\"mm\nVento: \"").concat(dados['maxwind_kph'], "\"kmh\n");
                        query = "\n                INSERT INTO previsao (temperatura_max, temperatura_min, temperatura_med, condicao_climatica, vento_max, precipitacao_max, data_log, local_assoc, data_col)\n                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)\n            ";
                        return [4 /*yield*/, conexao.query(query, [dados['maxtemp_c'], dados['mintemp_c'], dados['avgtemp_c'], dados['condition']['text'], dados['maxwind_kph'], dados['totalprecip_mm'], data, local, data_col])];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, (0, banco_1.encerrarConexao)()];
                    case 11:
                        _a.sent();
                        return [2 /*return*/, str];
                    case 12:
                        error_6 = _a.sent();
                        console.error('Erro ao adicionar dados!', error_6);
                        return [4 /*yield*/, (0, banco_1.encerrarConexao)()];
                    case 13:
                        _a.sent();
                        throw error_6;
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    //formato data: "AAAA-MM-DD"
    DadosAPI.prototype.inserirDadosPassado = function (dia) {
        return __awaiter(this, void 0, void 0, function () {
            var local, conexao, site, response, dados, data, query, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.localUsuario()];
                    case 1:
                        local = _a.sent();
                        return [4 /*yield*/, (0, banco_1.conectarBanco)()];
                    case 2:
                        conexao = _a.sent();
                        site = this.url + "/history.json?key=" + this.key + '&q=' + local + '&dt=' + dia + '&lang=pt';
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 9, , 10]);
                        return [4 /*yield*/, fetch(site)];
                    case 4:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 6];
                        return [4 /*yield*/, (0, banco_1.encerrarConexao)()];
                    case 5:
                        _a.sent();
                        throw new Error('Deu ruim');
                    case 6: return [4 /*yield*/, response.json()];
                    case 7:
                        dados = _a.sent();
                        data = new Date(dia);
                        dados = dados['forecast']['forecastday'][0].day;
                        query = "\n                INSERT INTO passado (temperatura_med, precipitacao_max, data_log, local_assoc, condicao_climatica, vento_max)\n                VALUES ($1, $2, $3, $4, $5, $6)\n            ";
                        return [4 /*yield*/, conexao.query(query, [dados['avgtemp_c'], dados['totalprecip_mm'], data, local, dados['condition']['text'], dados['maxwind_kph']])];
                    case 8:
                        _a.sent();
                        console.log("Dados adicionados com successo.");
                        return [3 /*break*/, 10];
                    case 9:
                        error_7 = _a.sent();
                        console.error('Erro ao adicionar dados!', error_7);
                        throw error_7;
                    case 10: return [4 /*yield*/, (0, banco_1.encerrarConexao)()];
                    case 11:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    //formato data: "AAAA-MM-DD"
    DadosAPI.prototype.inserirExibirDadosPassado = function (dia) {
        return __awaiter(this, void 0, void 0, function () {
            var local, conexao, site, response, dados, data, query, data2, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.localUsuario()];
                    case 1:
                        local = _a.sent();
                        return [4 /*yield*/, (0, banco_1.conectarBanco)()];
                    case 2:
                        conexao = _a.sent();
                        site = this.url + "/history.json?key=" + this.key + '&q=' + local + '&dt=' + dia + '&lang=pt';
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 9, , 10]);
                        return [4 /*yield*/, fetch(site)];
                    case 4:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 6];
                        return [4 /*yield*/, (0, banco_1.encerrarConexao)()];
                    case 5:
                        _a.sent();
                        throw new Error('Deu ruim');
                    case 6: return [4 /*yield*/, response.json()];
                    case 7:
                        dados = _a.sent();
                        data = new Date(dia);
                        dados = dados['forecast']['forecastday'][0].day;
                        query = "\n                INSERT INTO clima (temperatura, precipitacao, data_log, local_assoc, condicao_climatica, vento_max)\n                VALUES ($1, $2, $3, $4, $5, $6)\n            ";
                        return [4 /*yield*/, conexao.query(query, [dados['avgtemp_c'], dados['totalprecip_mm'], data, local, dados['condition']['text'], dados['maxwind_kph']])];
                    case 8:
                        _a.sent();
                        data2 = dia.slice(8, 10) + '/' + dia.slice(5, 7) + '/' + dia.slice(0, 4);
                        console.log("\nClima de \"".concat(local, "\" no dia \"").concat(data2, "\":\n\nCondi\u00E7\u00E3o Clim\u00E1tica: \"").concat(dados['condition']['text'], "\"\nTemperatura M\u00E9dia: \"").concat(dados['avgtemp_c'], "\"\u00BA\nPrecipita\u00E7\u00E3o: \"").concat(dados['totalprecip_mm'], "\"mm\nVento: \"").concat(dados['maxwind_kph'], "\"kmh\n"));
                        return [3 /*break*/, 10];
                    case 9:
                        error_8 = _a.sent();
                        console.error('Erro ao adicionar dados!', error_8);
                        throw error_8;
                    case 10: return [4 /*yield*/, (0, banco_1.encerrarConexao)()];
                    case 11:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    //formato data: "AAAA-MM-DD"
    DadosAPI.prototype.inserirRetornarDadosPassado = function (dia) {
        return __awaiter(this, void 0, void 0, function () {
            var local, conexao, site, response, dados, data, data2, str, query, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.localUsuario()];
                    case 1:
                        local = _a.sent();
                        return [4 /*yield*/, (0, banco_1.conectarBanco)()];
                    case 2:
                        conexao = _a.sent();
                        site = this.url + "/history.json?key=" + this.key + '&q=' + local + '&dt=' + dia + '&lang=pt';
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 10, , 12]);
                        return [4 /*yield*/, fetch(site)];
                    case 4:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 6];
                        return [4 /*yield*/, (0, banco_1.encerrarConexao)()];
                    case 5:
                        _a.sent();
                        throw new Error('Deu ruim');
                    case 6: return [4 /*yield*/, response.json()];
                    case 7:
                        dados = _a.sent();
                        data = new Date(dia);
                        dados = dados['forecast']['forecastday'][0].day;
                        data2 = dia.slice(8, 10) + '/' + dia.slice(5, 7) + '/' + dia.slice(0, 4);
                        str = "\nClima de \"".concat(local, "\" no dia \"").concat(data2, "\":\n\nCondi\u00E7\u00E3o Clim\u00E1tica: \"").concat(dados['condition']['text'], "\"\nTemperatura M\u00E9dia: \"").concat(dados['avgtemp_c'], "\"\u00BA\nPrecipita\u00E7\u00E3o: \"").concat(dados['totalprecip_mm'], "\"mm\nVento: \"").concat(dados['maxwind_kph'], "\"kmh\n");
                        query = "\n                INSERT INTO clima (temperatura, precipitacao, data_log, local_assoc, condicao_climatica, vento_max)\n                VALUES ($1, $2, $3, $4, $5, $6)\n            ";
                        return [4 /*yield*/, conexao.query(query, [dados['avgtemp_c'], dados['totalprecip_mm'], data, local, dados['condition']['text'], dados['maxwind_kph']])];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, (0, banco_1.encerrarConexao)()];
                    case 9:
                        _a.sent();
                        return [2 /*return*/, str];
                    case 10:
                        error_9 = _a.sent();
                        console.error('Erro ao adicionar dados!', error_9);
                        return [4 /*yield*/, (0, banco_1.encerrarConexao)()];
                    case 11:
                        _a.sent();
                        throw error_9;
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    return DadosAPI;
}());
exports.default = new DadosAPI;
