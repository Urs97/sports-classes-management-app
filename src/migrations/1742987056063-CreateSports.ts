import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSports1742987056063 implements MigrationInterface {
    name = 'CreateSports1742987056063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sport" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_6a16e1d83cb581484036cee92bf" UNIQUE ("name"), CONSTRAINT "PK_c67275331afac347120a1032825" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sport"`);
    }

}
