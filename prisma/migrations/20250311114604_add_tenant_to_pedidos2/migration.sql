-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "enderecoBairro" TEXT,
ADD COLUMN     "enderecoNumero" TEXT,
ADD COLUMN     "enderecoRua" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pendente',
ADD COLUMN     "valorFrete" DOUBLE PRECISION;
