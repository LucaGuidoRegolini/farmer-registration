-- CreateTable
CREATE TABLE "UserModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FarmerModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FarmerModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FarmModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "total_area" DOUBLE PRECISION NOT NULL,
    "total_agricultural_area" DOUBLE PRECISION NOT NULL,
    "total_vegetation_area" DOUBLE PRECISION NOT NULL,
    "farmenId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FarmModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CropModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CropModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CropModelToFarmModel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserModel_id_key" ON "UserModel"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserModel_name_key" ON "UserModel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FarmerModel_id_key" ON "FarmerModel"("id");

-- CreateIndex
CREATE UNIQUE INDEX "FarmModel_id_key" ON "FarmModel"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CropModel_id_key" ON "CropModel"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CropModel_name_key" ON "CropModel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CropModelToFarmModel_AB_unique" ON "_CropModelToFarmModel"("A", "B");

-- CreateIndex
CREATE INDEX "_CropModelToFarmModel_B_index" ON "_CropModelToFarmModel"("B");

-- AddForeignKey
ALTER TABLE "FarmerModel" ADD CONSTRAINT "FarmerModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FarmModel" ADD CONSTRAINT "FarmModel_farmenId_fkey" FOREIGN KEY ("farmenId") REFERENCES "FarmerModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FarmModel" ADD CONSTRAINT "FarmModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CropModelToFarmModel" ADD CONSTRAINT "_CropModelToFarmModel_A_fkey" FOREIGN KEY ("A") REFERENCES "CropModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CropModelToFarmModel" ADD CONSTRAINT "_CropModelToFarmModel_B_fkey" FOREIGN KEY ("B") REFERENCES "FarmModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
