import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueDepartmentNameUpgrade1720429264325 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create a unique index on the name column where deleted_at is null
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_UNIQUE_NAME_NOT_DELETED" ON "department" ("name") 
            WHERE "deleted_at" IS NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "IDX_UNIQUE_NAME_NOT_DELETED";
        `);
    }
}
