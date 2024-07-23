import { MigrationInterface, QueryRunner } from 'typeorm';

export class LMSIsbnExtraRemove1721409087791 implements MigrationInterface {
    name = 'LMSIsbnExtraRemove1721409087791';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_bd183604b9c828c0bdd92cafab"`);
        await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "isbn"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" ADD "isbn" bigint NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_bd183604b9c828c0bdd92cafab" ON "book" ("isbn") `);
    }
}
