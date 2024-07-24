import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import AbstractEntity from './abstract-entity';

@Entity()
export class GenreDB extends AbstractEntity {
    @Column({ unique: true })
    name: string;
}
