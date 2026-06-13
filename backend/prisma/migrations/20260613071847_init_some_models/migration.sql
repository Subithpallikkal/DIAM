-- CreateTable
CREATE TABLE "audit_engagements" (
    "uid" SERIAL NOT NULL,
    "clientUid" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "auditType" TEXT NOT NULL,
    "financialYear" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "description" TEXT,
    "createdByUid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audit_engagements_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "audit_scopes" (
    "uid" SERIAL NOT NULL,
    "engagementUid" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "audit_scopes_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "clients" (
    "uid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "gstNumber" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdByUid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "engagement_documents" (
    "uid" SERIAL NOT NULL,
    "engagementUid" INTEGER NOT NULL,
    "documentName" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "isReceived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "engagement_documents_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "roles" (
    "uid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "users" (
    "uid" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roleUid" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "audit_engagements" ADD CONSTRAINT "audit_engagements_clientUid_fkey" FOREIGN KEY ("clientUid") REFERENCES "clients"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_engagements" ADD CONSTRAINT "audit_engagements_createdByUid_fkey" FOREIGN KEY ("createdByUid") REFERENCES "users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_scopes" ADD CONSTRAINT "audit_scopes_engagementUid_fkey" FOREIGN KEY ("engagementUid") REFERENCES "audit_engagements"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_createdByUid_fkey" FOREIGN KEY ("createdByUid") REFERENCES "users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engagement_documents" ADD CONSTRAINT "engagement_documents_engagementUid_fkey" FOREIGN KEY ("engagementUid") REFERENCES "audit_engagements"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleUid_fkey" FOREIGN KEY ("roleUid") REFERENCES "roles"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
