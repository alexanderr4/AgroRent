/*
  Warnings:

  - The primary key for the `imagenes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `atributo` on the `imagenes` table. All the data in the column will be lost.
  - You are about to drop the column `id_atributo` on the `imagenes` table. All the data in the column will be lost.
  - Added the required column `id_imagen` to the `imagenes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `imagenes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `alquiler_maquinas` ADD COLUMN `estado` ENUM('I', 'F', 'P') NOT NULL DEFAULT 'P';

-- AlterTable
ALTER TABLE `imagenes` DROP PRIMARY KEY,
    DROP COLUMN `atributo`,
    DROP COLUMN `id_atributo`,
    ADD COLUMN `id_imagen` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `path` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_imagen`);

-- AlterTable
ALTER TABLE `usuarios` MODIFY `imagen` VARCHAR(191) NULL;
