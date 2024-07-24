import { MigrationInterface, QueryRunner } from 'typeorm';

export class LMSBookDetailAddGenre1721759741277 implements MigrationInterface {
    name = 'LMSBookDetailAddGenre1721759741277';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "genre_db" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "UQ_7a613be172616d8442abbea7966" UNIQUE ("name"), CONSTRAINT "PK_580bf8b6747c6a90fb4f826cac7" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`ALTER TABLE "book_detail" ADD "genre_id" integer`);
        await queryRunner.query(
            `ALTER TABLE "book_detail" ADD CONSTRAINT "FK_56c44e41dc437474befbc117630" FOREIGN KEY ("genre_id") REFERENCES "genre_db"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book_detail" DROP CONSTRAINT "FK_56c44e41dc437474befbc117630"`);
        await queryRunner.query(`ALTER TABLE "book_detail" DROP COLUMN "genre_id"`);
        await queryRunner.query(`DROP TABLE "genre_db"`);
    }
}
