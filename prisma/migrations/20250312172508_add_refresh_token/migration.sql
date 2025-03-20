-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "refreshToken" TEXT,
ALTER COLUMN "phone" DROP NOT NULL;
