import { MigrationInterface, QueryRunner } from "typeorm";

export class LMSCodeUnique1721666406007 implements MigrationInterface {
    name = 'LMSCodeUnique1721666406007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_71c031d5f3795602580acda1b7"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9c9a20437f9d718862e5b6e376" ON "shelf" ("code") WHERE deleted_at IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_9c9a20437f9d718862e5b6e376"`);
        await queryRunner.query(`CREATE INDEX "IDX_71c031d5f3795602580acda1b7" ON "shelf" ("code") `);
    }

}
