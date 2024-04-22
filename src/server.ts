import * as express from "express";
import {PrismaClient} from "@prisma/client";

export const prisma = new PrismaClient();

const app = express();
const port = 5432;
const router = express.Router();

async function main() {
    app.use(express.json());
    app.use(router);

    app.all("*", (req: express.Request, res: express.Response) => {
        res.status(404).json({ error: `Rota ${req.originalUrl} não encontrada` });
    });

    app.listen(port, () => {
        console.log(`Conectado ao Banco na porta: ${port}`);
    });
}

export async function conectar(){
    main().then(async () => {
        await prisma.$connect();
    }).catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
      });
}

export async function desconectar(){
    console.log(`Desconectado do Banco na porta: ${port}`);
    await prisma.$disconnect();
    process.exit(1);
}
