-- CreateTable
CREATE TABLE "TenantUsuario" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "TenantUsuario_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TenantUsuario" ADD CONSTRAINT "TenantUsuario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantUsuario" ADD CONSTRAINT "TenantUsuario_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
