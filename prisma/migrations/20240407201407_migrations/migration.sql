-- CreateTable
CREATE TABLE "avaliacao" (
    "id_avaliacao" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_dado_clima" INTEGER NOT NULL,
    "data" TIMESTAMP(6),
    "comentario" VARCHAR(512),
    "estado_clima" VARCHAR(100),
    "estado_temperatura" VARCHAR(100),

    CONSTRAINT "avaliacao_pkey" PRIMARY KEY ("id_avaliacao")
);

-- CreateTable
CREATE TABLE "clima" (
    "id_dado_clima" SERIAL NOT NULL,
    "temperatura" DOUBLE PRECISION,
    "precipitacao" DOUBLE PRECISION,
    "data_log" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "local_assoc" VARCHAR(255),
    "condicao_climatica" VARCHAR(20),
    "vento_max" DOUBLE PRECISION,
    "umidade" INTEGER,
    "sensacao_termica" DOUBLE PRECISION,

    CONSTRAINT "clima_pkey" PRIMARY KEY ("id_dado_clima")
);

-- CreateTable
CREATE TABLE "previsao" (
    "id_dado_previsao" SERIAL NOT NULL,
    "temperatura_max" DOUBLE PRECISION,
    "temperatura_min" DOUBLE PRECISION,
    "temperatura_med" DOUBLE PRECISION,
    "condicao_climatica" VARCHAR(50),
    "vento_max" DOUBLE PRECISION,
    "precipitacao_max" DOUBLE PRECISION,
    "probabilidade_chuva" INTEGER,
    "data_log" DATE,
    "local_assoc" VARCHAR(20),
    "umidade" INTEGER,

    CONSTRAINT "previsao_pkey" PRIMARY KEY ("id_dado_previsao")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "login" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "senha" VARCHAR(36) NOT NULL,
    "local_assoc" VARCHAR(255),

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_login_key" ON "usuario"("login");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_id_dado_clima_fkey" FOREIGN KEY ("id_dado_clima") REFERENCES "clima"("id_dado_clima") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "avaliacao_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION;
