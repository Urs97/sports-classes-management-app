import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHashedRefreshTokenToUsers1743216296828 implements MigrationInterface {
    name = 'AddHashedRefreshTokenToUsers1743216296828'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "hashedRefreshToken" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "hashedRefreshToken"`);
    }

}
