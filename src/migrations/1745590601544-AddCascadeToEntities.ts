import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeToEntities1745590601544 implements MigrationInterface {
  name = 'AddCascadeToEntities1745590601544';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const adminUser = await queryRunner.query(`
      SELECT id FROM users WHERE role = 'admin' ORDER BY id ASC LIMIT 1
    `);

    if (adminUser.length === 0) {
      throw new Error('No admin user found. Cannot safely update orphaned classes.');
    }

    const adminId = adminUser[0].id;

    await queryRunner.query(`
      UPDATE classes SET "createdById" = ${adminId} WHERE "createdById" IS NULL
    `);

    await queryRunner.query(`ALTER TABLE "classes" DROP CONSTRAINT IF EXISTS "FK_classes_createdBy_users"`);
    await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT IF EXISTS "FK_de33d443c8ae36800c37c58c929"`);
    await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT IF EXISTS "FK_470304681bce2933d3cbb680db8"`);

    await queryRunner.query(`ALTER TABLE "classes" ALTER COLUMN "createdById" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "enrollments" ALTER COLUMN "userId" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "enrollments" ALTER COLUMN "classId" SET NOT NULL`);

    await queryRunner.query(`
      ALTER TABLE "classes"
      ADD CONSTRAINT "FK_38f8de3ee0fa4d0342572070dd7"
      FOREIGN KEY ("createdById")
      REFERENCES "users"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "enrollments"
      ADD CONSTRAINT "FK_de33d443c8ae36800c37c58c929"
      FOREIGN KEY ("userId")
      REFERENCES "users"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "enrollments"
      ADD CONSTRAINT "FK_470304681bce2933d3cbb680db8"
      FOREIGN KEY ("classId")
      REFERENCES "classes"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT IF EXISTS "FK_470304681bce2933d3cbb680db8"`);
    await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT IF EXISTS "FK_de33d443c8ae36800c37c58c929"`);
    await queryRunner.query(`ALTER TABLE "classes" DROP CONSTRAINT IF EXISTS "FK_38f8de3ee0fa4d0342572070dd7"`);

    await queryRunner.query(`ALTER TABLE "enrollments" ALTER COLUMN "classId" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "enrollments" ALTER COLUMN "userId" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "classes" ALTER COLUMN "createdById" DROP NOT NULL`);

    await queryRunner.query(`
      ALTER TABLE "enrollments"
      ADD CONSTRAINT "FK_470304681bce2933d3cbb680db8"
      FOREIGN KEY ("classId")
      REFERENCES "classes"("id")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "enrollments"
      ADD CONSTRAINT "FK_de33d443c8ae36800c37c58c929"
      FOREIGN KEY ("userId")
      REFERENCES "users"("id")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "classes"
      ADD CONSTRAINT "FK_classes_createdBy_users"
      FOREIGN KEY ("createdById")
      REFERENCES "users"("id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION
    `);
  }
}
