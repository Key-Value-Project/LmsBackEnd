import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAgeEmployee1720084698091 implements MigrationInterface {
    name = 'AddAgeEmployee1720084698091';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ADD "age" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "age"`);
    }
}
