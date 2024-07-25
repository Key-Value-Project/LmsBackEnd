import { MigrationInterface, QueryRunner } from 'typeorm';

export class LMSEntityAdd1721404416424 implements MigrationInterface {
    name = 'LMSEntityAdd1721404416424';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "book_detail" ("isbn" bigint NOT NULL, "title" character varying NOT NULL, "author" character varying NOT NULL, "description" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_bdd0e3b677555ff1d6996145d2b" PRIMARY KEY ("isbn"))`
        );
        await queryRunner.query(
            `CREATE TABLE "book" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "isbn" bigint NOT NULL, "isborrow" boolean NOT NULL, "shelf_id" uuid, "book_detail_isbn" bigint, CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`CREATE INDEX "IDX_bd183604b9c828c0bdd92cafab" ON "book" ("isbn") `);
        await queryRunner.query(
            `CREATE TABLE "shelf" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "code" character varying NOT NULL, "location" character varying NOT NULL, CONSTRAINT "UQ_71c031d5f3795602580acda1b75" UNIQUE ("code"), CONSTRAINT "PK_da2ce57e38dfc635d50d0e5fc8f" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`CREATE INDEX "IDX_71c031d5f3795602580acda1b7" ON "shelf" ("code") `);
        await queryRunner.query(
            `CREATE TABLE "borrowed_history" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "borrowed_at" TIMESTAMP NOT NULL, "expected_return_date" TIMESTAMP NOT NULL, "return_date" TIMESTAMP, "user_id" integer, "borrowed_shelf_id" uuid, "return_shelf_id" uuid, "book_id" uuid, CONSTRAINT "PK_745c692ec30fb5155793d5c9e30" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "subscription" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "sent_request" boolean NOT NULL, "user_id" integer, "book_detail_isbn" bigint, CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "book" ADD CONSTRAINT "FK_e16898fd97bfd050058b0cc3800" FOREIGN KEY ("shelf_id") REFERENCES "shelf"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "book" ADD CONSTRAINT "FK_57f892085ff723c1ca385a3e40b" FOREIGN KEY ("book_detail_isbn") REFERENCES "book_detail"("isbn") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "borrowed_history" ADD CONSTRAINT "FK_8df40b9d82aa944d06d267767bf" FOREIGN KEY ("user_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "borrowed_history" ADD CONSTRAINT "FK_dbae5a356ba923ed7dbb8235276" FOREIGN KEY ("borrowed_shelf_id") REFERENCES "shelf"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "borrowed_history" ADD CONSTRAINT "FK_6ef24ca6239ee71168ec9af9eda" FOREIGN KEY ("return_shelf_id") REFERENCES "shelf"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "borrowed_history" ADD CONSTRAINT "FK_8c3b8a3fde82cf1cc47512c9565" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "subscription" ADD CONSTRAINT "FK_940d49a105d50bbd616be540013" FOREIGN KEY ("user_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "subscription" ADD CONSTRAINT "FK_551e717bb49c4dcc88cfee823e1" FOREIGN KEY ("book_detail_isbn") REFERENCES "book_detail"("isbn") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_551e717bb49c4dcc88cfee823e1"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_940d49a105d50bbd616be540013"`);
        await queryRunner.query(`ALTER TABLE "borrowed_history" DROP CONSTRAINT "FK_8c3b8a3fde82cf1cc47512c9565"`);
        await queryRunner.query(`ALTER TABLE "borrowed_history" DROP CONSTRAINT "FK_6ef24ca6239ee71168ec9af9eda"`);
        await queryRunner.query(`ALTER TABLE "borrowed_history" DROP CONSTRAINT "FK_dbae5a356ba923ed7dbb8235276"`);
        await queryRunner.query(`ALTER TABLE "borrowed_history" DROP CONSTRAINT "FK_8df40b9d82aa944d06d267767bf"`);
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "FK_57f892085ff723c1ca385a3e40b"`);
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "FK_e16898fd97bfd050058b0cc3800"`);
        await queryRunner.query(`DROP TABLE "subscription"`);
        await queryRunner.query(`DROP TABLE "borrowed_history"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_71c031d5f3795602580acda1b7"`);
        await queryRunner.query(`DROP TABLE "shelf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bd183604b9c828c0bdd92cafab"`);
        await queryRunner.query(`DROP TABLE "book"`);
        await queryRunner.query(`DROP TABLE "book_detail"`);
    }
}
