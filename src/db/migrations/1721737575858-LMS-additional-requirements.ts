import { MigrationInterface, QueryRunner } from 'typeorm';

export class LMSAdditionalRequirements1721737575858 implements MigrationInterface {
    name = 'LMSAdditionalRequirements1721737575858';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "review" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "rating" integer NOT NULL, "comment" text NOT NULL, "book_detail_isbn" bigint, "employee_id" integer, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`ALTER TABLE "book_detail" ADD "borrow_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`CREATE INDEX "IDX_e8142326d2bff2e8c5ce547ca5" ON "book_detail" ("title") `);
        await queryRunner.query(
            `ALTER TABLE "review" ADD CONSTRAINT "FK_49b5d587f80b8e04949c65ac589" FOREIGN KEY ("book_detail_isbn") REFERENCES "book_detail"("isbn") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "review" ADD CONSTRAINT "FK_c2c3f80c330f92b7d21b5e2efe1" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_c2c3f80c330f92b7d21b5e2efe1"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_49b5d587f80b8e04949c65ac589"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e8142326d2bff2e8c5ce547ca5"`);
        await queryRunner.query(`ALTER TABLE "book_detail" DROP COLUMN "borrow_count"`);
        await queryRunner.query(`DROP TABLE "review"`);
    }
}
