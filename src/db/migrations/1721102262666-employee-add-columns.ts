import { MigrationInterface, QueryRunner } from 'typeorm';

export class EmployeeAddColumns1721102262666 implements MigrationInterface {
    name = 'EmployeeAddColumns1721102262666';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "age"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "experience" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "status" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "experience"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "age" integer NOT NULL`);
    }
}
