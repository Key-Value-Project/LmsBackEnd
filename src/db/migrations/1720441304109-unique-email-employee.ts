import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueEmailEmployee1720441304109 implements MigrationInterface {
    name = 'UniqueEmailEmployee1720441304109';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_UNIQUE_NAME_NOT_DELETED"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f36ca39d95212d80c1e9ba0569" ON "department" ("name") WHERE deleted_at IS NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_699de4fc7d85ad51a5981b3ff4" ON "employee" ("email") WHERE deleted_at IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_699de4fc7d85ad51a5981b3ff4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f36ca39d95212d80c1e9ba0569"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_UNIQUE_NAME_NOT_DELETED" ON "department" ("name") WHERE (deleted_at IS NULL)`);
    }
}
