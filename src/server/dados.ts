import {conectarBanco, encerrarConexao, getUsuario} from './banco';

class DadosAPI{
    idUsuario: number;
    readonly url: string;
    readonly key: string;

    constructor(idUsuario: number){
        this.idUsuario = idUsuario;
        this.key = "3a0d1a4a72d54c0bb3804412242103";
        this.url = "http://api.weatherapi.com/v1";
    }

    async localUsuario(): Promise<string>{
        await conectarBanco();
        const usuario = await getUsuario();

        for(var u of usuario){
            if(u['id_usuario']===this.idUsuario){
                await encerrarConexao();
                return u['local_assoc'];
            }
        }
        await encerrarConexao();
        return "Usuário não encontrado"
    }

    async inserirDadosClimaAtual(){
        let local = await this.localUsuario();
        let conexao = await conectarBanco();

        if(local==="Usuário não encontrado"){
            console.log(local);
        }
        else{
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
                const local_assoc = local;
                const condicao_climatica = dados['current']['condition']['text'];
                const vento_max = dados['current']['wind_kph'];
                const umidade = dados['current']['humidity'];
                const sensacao_termica = dados['current']['feelslike_c'];

                const query = `
                    INSERT INTO clima (temperatura, precipitacao, local_assoc, condicao_climatica, vento_max, umidade, sensacao_termica)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                `;

                await conexao.query(query, [temperatura, precipitacao, local_assoc, condicao_climatica, vento_max, umidade, sensacao_termica]);

            }catch(error) {
                console.error('Erro', error);
                await encerrarConexao();
                throw error;
            }
        }
        await encerrarConexao();
    }

    //formato data: "AAAA-MM-DD"
    async inserirDadosPrevisao(dia: string){
        let local = await this.localUsuario();
        let conexao = await conectarBanco();

        if(local==="Usuário não encontrado"){
            console.log(local);
        }
        else{
            const data = new Date(dia);
            const hoje = new Date();
            let data2 = new Date(hoje);
            let data3 = new Date(hoje);

            data2.setDate(hoje.getDate() + 14);
            data3.setDate(hoje.getDate() + 300);

            let  site: string;

            if(data<data2){
                site = this.url + "/forecast.json?key=" + this.key + '&q=' + local + '&days=1&dt=' + dia + '&lang=pt';
            }
            else if(data<=data3){
                site = this.url + "/future.json?key=" + this.key + '&q=' + local + '&dt=' + dia + '&lang=pt';
            }
            else{
                console.log(`\nData muito distante, escolha um dia entre "${hoje}" e "${data3}\n"`)
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
                
                const query = `
                    INSERT INTO previsao (temperatura_max, temperatura_min, temperatura_med, condicao_climatica, vento_max, precipitacao_max, probabilidade_chuva, data_log, local_assoc, umidade)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                `;
                await conexao.query(query, [dados['maxtemp_c'], dados['mintemp_c'], dados['avgtemp_c'], dados['condition']['text'], dados['maxwind_kph'], dados['totalprecip_mm'], dados['daily_chance_of_rain'], data, local, dados['avghumidity']]);

            }catch(error) {
                console.error('Erro', error);
                await encerrarConexao();
                throw error;
            }
        }
        await encerrarConexao();
    }

    //formato data: "AAAA-MM-DD"
    async inserirDadosPassado(dia: string){
        let local = await this.localUsuario();
        let conexao = await conectarBanco();

        if(local==="Usuário não encontrado"){
            console.log(local);
        }
        else{
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
                    INSERT INTO passado (temperatura_max, temperatura_min, temperatura_med, condicao_climatica, vento_max, precipitacao_max, probabilidade_chuva, data_log, local_assoc, umidade)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                `;
                await conexao.query(query, [dados['maxtemp_c'], dados['mintemp_c'], dados['avgtemp_c'], dados['condition']['text'], dados['maxwind_kph'], dados['totalprecip_mm'], dados['daily_chance_of_rain'], data, local, dados['avghumidity']]);

            }catch(error) {
                console.error('Erro', error);
                await encerrarConexao();
                throw error;
            }
        }
        await encerrarConexao();
    }

}