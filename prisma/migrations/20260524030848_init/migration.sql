-- CreateTable
CREATE TABLE "PantryItem" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL DEFAULT 'local',
    "name" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "brand" TEXT,
    "kcal" DOUBLE PRECISION,
    "protein" DOUBLE PRECISION,
    "carbs" DOUBLE PRECISION,
    "fat" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PantryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PantryItem_ownerId_idx" ON "PantryItem"("ownerId");
