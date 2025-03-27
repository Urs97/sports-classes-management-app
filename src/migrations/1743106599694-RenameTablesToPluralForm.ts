import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTablesToPluralForm1743106599694 implements MigrationInterface {
    name = 'RenameTablesToPluralForm1743106599694'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameTable('user', 'users');
        await queryRunner.renameTable('sport', 'sports');
        await queryRunner.renameTable('schedule', 'schedules');
        await queryRunner.renameTable('class', 'classes');
        await queryRunner.renameTable('enrollment', 'enrollments');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameTable('users', 'user');
        await queryRunner.renameTable('sports', 'sport');
        await queryRunner.renameTable('schedules', 'schedule');
        await queryRunner.renameTable('classes', 'class');
        await queryRunner.renameTable('enrollments', 'enrollment');
    }

}
