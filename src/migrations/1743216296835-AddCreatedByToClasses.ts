import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedByToClasses1743216296835 implements MigrationInterface {
  name = 'AddCreatedByToClasses1743216296835';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "classes"
      ADD "createdById" integer;
    `);
    await queryRunner.query(`
      ALTER TABLE "classes"
      ADD CONSTRAINT "FK_classes_createdBy_users"
      FOREIGN KEY ("createdById")
      REFERENCES "users"("id")
      ON DELETE SET NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "classes"
      DROP CONSTRAINT "FK_classes_createdBy_users";
    `);
    await queryRunner.query(`
      ALTER TABLE "classes"
      DROP COLUMN "createdById";
    `);
  }
}
