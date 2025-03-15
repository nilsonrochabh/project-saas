/*
  Warnings:

  - You are about to drop the column `usuarioFinalId` on the `Endereco` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioFinalId` on the `Pedido` table. All the data in the column will be lost.
  - You are about to drop the `UsuarioFinal` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email,tenantId]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usuarioId` to the `Endereco` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Pedido` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Endereco" DROP CONSTRAINT "Endereco_usuarioFinalId_fkey";

-- DropForeignKey
ALTER TABLE "Pedido" DROP CONSTRAINT "Pedido_usuarioFinalId_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioFinal" DROP CONSTRAINT "UsuarioFinal_tenantId_fkey";

-- AlterTable
ALTER TABLE "Endereco" DROP COLUMN "usuarioFinalId",
ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Pedido" DROP COLUMN "usuarioFinalId",
ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "UsuarioFinal";

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_tenantId_key" ON "Usuario"("email", "tenantId");

-- AddForeignKey
ALTER TABLE "Endereco" ADD CONSTRAINT "Endereco_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
