/*
  Warnings:

  - You are about to drop the column `enderecoBairro` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `enderecoNumero` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `enderecoRua` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the column `valorFrete` on the `Pedido` table. All the data in the column will be lost.
  - You are about to alter the column `valorTotal` on the `Pedido` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "Pedido" DROP COLUMN "enderecoBairro",
DROP COLUMN "enderecoNumero",
DROP COLUMN "enderecoRua",
DROP COLUMN "status",
DROP COLUMN "valorFrete",
ALTER COLUMN "valorTotal" SET DATA TYPE DECIMAL(10,2);
