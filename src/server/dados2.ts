import {conectarBanco, encerrarConexao, getUsuario} from './banco';

class DadosAPI{
    readonly url: string;
    readonly key: string;

    constructor(){
        this.key = "3a0d1a4a72d54c0bb3804412242103";
        this.url = "http://api.weatherapi.com/v1";
    }

    async localUsuario(){const response = await fetch("https://ipapi.co/city/");
        const local = await response.text();
        return local;
    }

    async inserirDadosClimaAtual(){
        let local = await this.localUsuario();
        let conexao = await conectarBanco();
        const site = this.url + "/current.json?key=" + this.key + '&q=' + local + '&lang=pt';
        
        try {
            const response = await fetch(site);
            if (!response.ok) {
                await encerrarConexao();
                throw new Error('Deu ruim');
            }
            const dados = await response.json();

            const temperatura = dados['current']['temp_c'];
            const precipitacao = dados['current']['precip_mm'];
            let data_log: Date = new Date(dados['location']['localtime']);
            data_log.setHours(data_log.getHours() - 3);
            const local_assoc = local;
            const condicao_climatica = dados['current']['condition']['text'];
            const vento_max = dados['current']['wind_kph'];

            const query = `
                INSERT INTO clima (temperatura, precipitacao, data_log, local_assoc, condicao_climatica, vento_max)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;

            await conexao.query(query, [temperatura, precipitacao, data_log, local_assoc, condicao_climatica, vento_max]);
            console.log("Dados adicionados com successo.");
        }catch(error) {
            console.error('Erro ao adicionar dados!', error);
            throw error;
        }
        await encerrarConexao();
    }

    async inserirExibirDadosClimaAtual(){
        let local = await this.localUsuario();
        let conexao = await conectarBanco();
        const site = this.url + "/current.json?key=" + this.key + '&q=' + local + '&lang=pt';
        
        try {
            const response = await fetch(site);
            if (!response.ok) {
                await encerrarConexao();
                throw new Error('Deu ruim');
            }
            const dados = await response.json();
            const dia = dados['location']['localtime'];
            const temperatura = dados['current']['temp_c'];
            const precipitacao = dados['current']['precip_mm'];
            let data_log: Date = new Date(dia);
            const local_assoc = local;
            const condicao_climatica = dados['current']['condition']['text'];
            const vento_max = dados['current']['wind_kph'];

            const query = `
                INSERT INTO clima (temperatura, precipitacao, data_log, local_assoc, condicao_climatica, vento_max)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;

            await conexao.query(query, [temperatura, precipitacao, data_log, local_assoc, condicao_climatica, vento_max]);
            const dataHora = dia.slice(8,10) + '/' + dia.slice(5,7) + '/' + dia.slice(0,4) + ' às ' + dia.slice(11,16);
            console.log(`\nClima de "${local}" no dia "${dataHora}":\n\nCondição Climática: "${condicao_climatica}"\nTemperatura: "${temperatura}"º\nPrecipitação: "${precipitacao}"mm\nVento: "${vento_max}"kmh\n`);
        }catch(error) {
            console.error('Erro ao carregar dados!', error);
            throw error;
        }
        await encerrarConexao();
    }

    async inserirRetornarDadosClimaAtual(){
        let local = await this.localUsuario();
        let conexao = await conectarBanco();
        const site = this.url + "/current.json?key=" + this.key + '&q=' + local + '&lang=pt';
        
        try {
            const response = await fetch(site);
            if (!response.ok) {
                await encerrarConexao();
                throw new Error('Deu ruim');
            }
            const dados = await response.json();
            const dia = dados['location']['localtime'];
            const temperatura = dados['current']['temp_c'];
            const precipitacao = dados['current']['precip_mm'];
            let data_log: Date = new Date(dia);
            const local_assoc = local;
            const condicao_climatica = dados['current']['condition']['text'];
            const vento_max = dados['current']['wind_kph'];
            const dataHora = dia.slice(8,10) + '/' + dia.slice(5,7) + '/' + dia.slice(0,4) + ' às ' + dia.slice(11,16);
            const str = `\nClima de "${local}" no dia "${dataHora}":\n\nCondição Climática: "${condicao_climatica}"\nTemperatura: "${temperatura}"º\nPrecipitação: "${precipitacao}"mm\nVento: "${vento_max}"kmh\n`;
            const query = `
                INSERT INTO clima (temperatura, precipitacao, data_log, local_assoc, condicao_climatica, vento_max)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;
            await conexao.query(query, [temperatura, precipitacao, data_log, local_assoc, condicao_climatica, vento_max]);
            await encerrarConexao();
            return str;
        }catch(error) {
            console.error('Erro ao carregar dados!', error);
            await encerrarConexao();
            throw error;
        }
    }

    //formato data: "AAAA-MM-DD"
    async inserirDadosPrevisao(dia: string){
        let local = await this.localUsuario();
        let conexao = await conectarBanco();
        const data = new Date(dia);
        const hoje = new Date();
        let data2 = new Date(hoje);

        data2.setDate(hoje.getDate() + 14);

        let  site: string;

        if(data<data2){
            site = this.url + "/forecast.json?key=" + this.key + '&q=' + local + '&days=1&dt=' + dia + '&lang=pt';
        }
        else{
            console.log(`\nData muito distante, escolha um dia entre "${hoje}" e "${data2}\n"`)
            await encerrarConexao();
            return;
        }
        
        try {
            const response = await fetch(site);
            if (!response.ok) {
                await encerrarConexao();
                throw new Error('Deu ruim');
            }
            let dados = await response.json();
            dados = dados['forecast']['forecastday'][0].day;
            let data_col: Date = new Date(dados['location']['localtime']);
            data_col.setHours(data_col.getHours() - 3);
            
            const query = `
                INSERT INTO previsao (temperatura_max, temperatura_min, temperatura_med, condicao_climatica, vento_max, precipitacao_max, data_log, local_assoc, data_col)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `;
            await conexao.query(query, [dados['maxtemp_c'], dados['mintemp_c'], dados['avgtemp_c'], dados['condition']['text'], dados['maxwind_kph'], dados['totalprecip_mm'], data, local, data_col]);
            console.log("Dados adicionados com successo.");
        }catch(error) {
            console.error('Erro ao adicionar dados!', error);
            throw error;
        }
        await encerrarConexao();
    }

    //formato data: "AAAA-MM-DD"
    async inserirExibirDadosPrevisao(dia: string){
        let local = await this.localUsuario();
        let conexao = await conectarBanco();
        const data = new Date(dia);
        const hoje = new Date();
        let data2 = new Date(hoje);

        data2.setDate(hoje.getDate() + 14);

        let  site: string;

        if(data<data2){
            site = this.url + "/forecast.json?key=" + this.key + '&q=' + local + '&days=1&dt=' + dia + '&lang=pt';
        }
        else{
            console.log(`\nData muito distante, escolha um dia entre "${hoje}" e "${data2}\n"`)
            await encerrarConexao();
            return;
        }
        
        try {
            const response = await fetch(site);
            if (!response.ok) {
                await encerrarConexao();
                throw new Error('Deu ruim');
            }
            let dados = await response.json();
            let data_col: Date = new Date(dados['location']['localtime']);
            dados = dados['forecast']['forecastday'][0].day;
            data_col.setHours(data_col.getHours() - 3);
            
            const query = `
                INSERT INTO previsao (temperatura_max, temperatura_min, temperatura_med, condicao_climatica, vento_max, precipitacao_max, data_log, local_assoc, data_col)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `;
            await conexao.query(query, [dados['maxtemp_c'], dados['mintemp_c'], dados['avgtemp_c'], dados['condition']['text'], dados['maxwind_kph'], dados['totalprecip_mm'], data, local, data_col]);
            const data3 = dia.slice(8,10) + '/' + dia.slice(5,7) + '/' + dia.slice(0,4);
            console.log(`\nClima de "${local}" no dia "${data3}":\n\nCondição Climática: "${dados['condition']['text']}"\nTemperatura Máxima: "${dados['maxtemp_c']}"º\nTemperatura Mínima: "${dados['mintemp_c']}"º\nTemperatura Média: "${dados['avgtemp_c']}"º\nPrecipitação: "${dados['totalprecip_mm']}"mm\nVento: "${dados['maxwind_kph']}"kmh\n`);
        }catch(error) {
            console.error('Erro ao adicionar dados!', error);
            throw error;
        }
        await encerrarConexao();
    }

     //formato data: "AAAA-MM-DD"
     async inserirRetornarDadosPrevisao(dia: string){
        let local = await this.localUsuario();
        let conexao = await conectarBanco();
        const data = new Date(dia);
        const hoje = new Date();
        let data2 = new Date(hoje);

        data2.setDate(hoje.getDate() + 14);

        let  site: string;

        if(data<data2){
            site = this.url + "/forecast.json?key=" + this.key + '&q=' + local + '&days=1&dt=' + dia + '&lang=pt';
        }
        else{
            console.log(`\nData muito distante, escolha um dia entre "${hoje}" e "${data2}\n"`)
            await encerrarConexao();
            return;
        }
        
        try {
            const response = await fetch(site);
            if (!response.ok) {
                await encerrarConexao();
                throw new Error('Deu ruim');
            }
            let dados = await response.json();
            let data_col: Date = new Date(dados['location']['localtime']);
            dados = dados['forecast']['forecastday'][0].day;
            data_col.setHours(data_col.getHours() - 3);
            const data3 = dia.slice(8,10) + '/' + dia.slice(5,7) + '/' + dia.slice(0,4);
            const str = `\nClima de "${local}" no dia "${data3}":\n\nCondição Climática: "${dados['condition']['text']}"\nTemperatura Máxima: "${dados['maxtemp_c']}"º\nTemperatura Mínima: "${dados['mintemp_c']}"º\nTemperatura Média: "${dados['avgtemp_c']}"º\nPrecipitação: "${dados['totalprecip_mm']}"mm\nVento: "${dados['maxwind_kph']}"kmh\n`;
            const query = `
                INSERT INTO previsao (temperatura_max, temperatura_min, temperatura_med, condicao_climatica, vento_max, precipitacao_max, data_log, local_assoc, data_col)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `;
            await conexao.query(query, [dados['maxtemp_c'], dados['mintemp_c'], dados['avgtemp_c'], dados['condition']['text'], dados['maxwind_kph'], dados['totalprecip_mm'], data, local, data_col]);
            await encerrarConexao();
            return str;
        }catch(error) {
            console.error('Erro ao adicionar dados!', error);
            await encerrarConexao();
            throw error;
        }
    }

    //formato data: "AAAA-MM-DD"
    async inserirDadosPassado(dia: string){
        let local = await this.localUsuario();
        let conexao = await conectarBanco();
        const site = this.url + "/history.json?key=" + this.key + '&q=' + local + '&dt=' + dia + '&lang=pt';
        
        try {
            const response = await fetch(site);
            if (!response.ok) {
                await encerrarConexao();
                throw new Error('Deu ruim');
            }
            let dados = await response.json();
            const data = new Date(dia);
            
            dados = dados['forecast']['forecastday'][0].day;
            
            const query = `
                INSERT INTO passado (temperatura_med, precipitacao_max, data_log, local_assoc, condicao_climatica, vento_max)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;
            await conexao.query(query, [dados['avgtemp_c'], dados['totalprecip_mm'], data, local, dados['condition']['text'], dados['maxwind_kph']]);
            console.log("Dados adicionados com successo.");
        }catch(error) {
            console.error('Erro ao adicionar dados!', error);
            throw error;
        }
        await encerrarConexao();
    }

     //formato data: "AAAA-MM-DD"
     async inserirExibirDadosPassado(dia: string){
        let local = await this.localUsuario();
        let conexao = await conectarBanco();
        const site = this.url + "/history.json?key=" + this.key + '&q=' + local + '&dt=' + dia + '&lang=pt';
        
        try {
            const response = await fetch(site);
            if (!response.ok) {
                await encerrarConexao();
                throw new Error('Deu ruim');
            }
            let dados = await response.json();
            const data = new Date(dia);
            
            dados = dados['forecast']['forecastday'][0].day;
            
            const query = `
                INSERT INTO clima (temperatura, precipitacao, data_log, local_assoc, condicao_climatica, vento_max)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;
            await conexao.query(query, [dados['avgtemp_c'], dados['totalprecip_mm'], data, local, dados['condition']['text'], dados['maxwind_kph']]);
            const data2 = dia.slice(8,10) + '/' + dia.slice(5,7) + '/' + dia.slice(0,4);
            console.log(`\nClima de "${local}" no dia "${data2}":\n\nCondição Climática: "${dados['condition']['text']}"\nTemperatura Média: "${dados['avgtemp_c']}"º\nPrecipitação: "${dados['totalprecip_mm']}"mm\nVento: "${dados['maxwind_kph']}"kmh\n`)
        }catch(error) {
            console.error('Erro ao adicionar dados!', error);
            throw error;
        }
        await encerrarConexao();
    }

    //formato data: "AAAA-MM-DD"
    async inserirRetornarDadosPassado(dia: string){
        let local = await this.localUsuario();
        let conexao = await conectarBanco();
        const site = this.url + "/history.json?key=" + this.key + '&q=' + local + '&dt=' + dia + '&lang=pt';
        
        try {
            const response = await fetch(site);
            if (!response.ok) {
                await encerrarConexao();
                throw new Error('Deu ruim');
            }
            let dados = await response.json();
            const data = new Date(dia);
            
            dados = dados['forecast']['forecastday'][0].day;
            const data2 = dia.slice(8,10) + '/' + dia.slice(5,7) + '/' + dia.slice(0,4);
            const str = `\nClima de "${local}" no dia "${data2}":\n\nCondição Climática: "${dados['condition']['text']}"\nTemperatura Média: "${dados['avgtemp_c']}"º\nPrecipitação: "${dados['totalprecip_mm']}"mm\nVento: "${dados['maxwind_kph']}"kmh\n`;
            const query = `
                INSERT INTO clima (temperatura, precipitacao, data_log, local_assoc, condicao_climatica, vento_max)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;
            await conexao.query(query, [dados['avgtemp_c'], dados['totalprecip_mm'], data, local, dados['condition']['text'], dados['maxwind_kph']]);
            await encerrarConexao();
            return str;
        }catch(error) {
            console.error('Erro ao adicionar dados!', error);
            await encerrarConexao();
            throw error;
        }
    }
}

export default new DadosAPI