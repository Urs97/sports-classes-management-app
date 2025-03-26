import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateClassesAndSchedules1742987244595 implements MigrationInterface {
    name = 'CreateClassesAndSchedules1742987244595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "schedule" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, "duration" integer NOT NULL, "classId" integer, CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "class" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "duration" integer NOT NULL, "sportId" integer, CONSTRAINT "PK_0b9024d21bdfba8b1bd1c300eae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_08aac4a7aad6819197a8ba8f3e8" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "class" ADD CONSTRAINT "FK_8b480ee07908d5424bd8779f68d" FOREIGN KEY ("sportId") REFERENCES "sport"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "class" DROP CONSTRAINT "FK_8b480ee07908d5424bd8779f68d"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_08aac4a7aad6819197a8ba8f3e8"`);
        await queryRunner.query(`DROP TABLE "class"`);
        await queryRunner.query(`DROP TABLE "schedule"`);
    }

}
