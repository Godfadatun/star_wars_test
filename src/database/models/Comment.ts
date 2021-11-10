/* eslint-disable import/no-cycle */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  commenter_ip: string;

  @Column()
  movie_id: string;

  @Column({ length: 500 })
  comment: string;

  @Column('timestamptz')
  created_at: Date;

  @Column('timestamptz')
  updated_at: Date;
}
